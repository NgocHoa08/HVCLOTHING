import React, { useEffect, useRef, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, type Timestamp } from 'firebase/firestore';
import { Check, Copy, Database, ExternalLink, ImagePlus, LogOut, Mail, PackagePlus, Pencil, Search, Shield, ShieldCheck, ShoppingBag, Trash2, Users, UserX, X } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useProducts } from '../context/useProducts';
import { formatPrice, PRODUCTS } from '../data/products';
import { firebaseDb } from '../lib/firebase';
import { deleteUploadedProductImages, uploadProductImages } from '../lib/product-images';
import type { Product, ProductCategory } from '../types/product';

type AdminTab = 'products' | 'orders' | 'subscribers' | 'users';

interface RegisteredUser {
  id: string;
  uid: string;
  email: string;
  name?: string;
  role?: 'admin' | 'customer';
  createdAt?: Timestamp;
  lastLoginAt?: Timestamp;
}

interface AdminOrder {
  id: string;
  orderCode: string;
  customer: { email: string; fullName: string; phone: string };
  shipping: { address: string; city: string; district: string; ward: string };
  items: Array<{ productId: string; name: string; size: string; color: string; quantity: number; unitPrice: number; lineTotal: number }>;
  subtotal: number;
  discount: number;
  couponCode: string;
  shippingFee: number;
  total: number;
  paymentMethod: 'cod' | 'bank' | 'card';
  status: 'new' | 'confirmed' | 'packing' | 'shipped' | 'completed' | 'cancelled';
  createdAt?: Timestamp;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'subscribed' | 'unsubscribed';
  createdAt?: Timestamp;
}

const orderStatusLabels: Record<AdminOrder['status'], string> = {
  new: 'Mới đặt', confirmed: 'Đã xác nhận', packing: 'Đang chuẩn bị',
  shipped: 'Đang giao', completed: 'Hoàn tất', cancelled: 'Đã hủy',
};

const paymentMethodLabels: Record<AdminOrder['paymentMethod'], string> = {
  cod: 'COD', bank: 'Chuyển khoản', card: 'Thẻ quốc tế',
};

const formatDate = (timestamp?: Timestamp) => timestamp
  ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp.toDate())
  : 'Đang cập nhật';

interface ProductForm {
  name: string;
  slug: string;
  category: ProductCategory;
  subcategory: string;
  price: string;
  salePrice: string;
  description: string;
  material: string;
  sizes: string;
  images: File[];
  existingImages: string[];
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
}

const emptyForm: ProductForm = {
  name: '', slug: '', category: 'women', subcategory: '', price: '', salePrice: '',
  description: '', material: '', sizes: 'S, M, L', images: [], existingImages: [],
  inStock: true, isNew: false, isFeatured: false, isBestSeller: false,
};

const categoryLabels: Record<ProductCategory, string> = {
  women: 'Thời Trang Nữ', men: 'Thời Trang Nam', accessories: 'Phụ Kiện & Giày', collections: 'Bộ Sưu Tập',
};

const formFromProduct = (product: Product): ProductForm => ({
  name: product.name,
  slug: product.slug,
  category: product.category,
  subcategory: product.subcategory,
  price: String(product.price),
  salePrice: product.salePrice === undefined ? '' : String(product.salePrice),
  description: product.description,
  material: product.material,
  sizes: product.sizes.join(', '),
  images: [],
  existingImages: product.images,
  inStock: product.inStock,
  isNew: Boolean(product.isNew),
  isFeatured: Boolean(product.isFeatured),
  isBestSeller: Boolean(product.isBestSeller),
});

const slugify = (value: string) => value.trim().toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const FileThumbnail: React.FC<{ file: File; onRemove: () => void }> = ({ file, onRemove }) => {
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (isMounted && typeof e.target?.result === 'string') {
        setPreview(e.target.result);
      }
    };
    reader.readAsDataURL(file);
    return () => {
      isMounted = false;
    };
  }, [file]);

  return (
    <div className="group relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border border-[#DADAD4] bg-[#F7F7F5]">
      {preview ? (
        <img src={preview} alt={file.name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[10px] text-[#888]">
          <div className="h-4 w-4 animate-spin rounded-full border border-[#263C36] border-t-transparent" />
        </div>
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Xóa ảnh ${file.name}`}
        title="Xóa ảnh này"
        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/75 text-white opacity-90 transition-opacity hover:bg-black group-hover:opacity-100"
      >
        <X size={12} aria-hidden="true" />
      </button>
      <span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-0.5 text-center text-[8px] text-white">
        {(file.size / 1024).toFixed(0)} KB
      </span>
    </div>
  );
};

export const Admin: React.FC = () => {
  const { user, logout } = useAuth();
  const { products, loading, error: catalogError, firebaseConfigured, saveProduct, deleteProduct, seedDefaultCatalog } = useProducts();
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(Boolean(firebaseDb));
  const [subscribersLoading, setSubscribersLoading] = useState(Boolean(firebaseDb));
  const [managementError, setManagementError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [adminsMap, setAdminsMap] = useState<Record<string, { email?: string; grantedBy?: string }>>({});
  const [usersLoading, setUsersLoading] = useState(Boolean(firebaseDb));
  const [targetAdminUid, setTargetAdminUid] = useState('');
  const [targetAdminEmail, setTargetAdminEmail] = useState('');
  const [adminActionLoading, setAdminActionLoading] = useState(false);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseDb) return;

    const unsubscribeOrders = onSnapshot(
      query(collection(firebaseDb, 'orders'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setOrders(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as AdminOrder));
        setOrdersLoading(false);
      },
      (snapshotError) => {
        setManagementError(`Không tải được đơn hàng: ${snapshotError.message}`);
        setOrdersLoading(false);
      },
    );
    const unsubscribeSubscribers = onSnapshot(
      query(collection(firebaseDb, 'newsletterSubscribers'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setSubscribers(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as NewsletterSubscriber));
        setSubscribersLoading(false);
      },
      (snapshotError) => {
        setManagementError(`Không tải được email đăng ký: ${snapshotError.message}`);
        setSubscribersLoading(false);
      },
    );

    const unsubscribeUsers = onSnapshot(
      collection(firebaseDb, 'users'),
      (snapshot) => {
        const list = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          uid: docItem.id,
          ...docItem.data(),
        }) as RegisteredUser);
        setRegisteredUsers(list);
        setUsersLoading(false);
      },
      () => {
        setUsersLoading(false);
      },
    );

    const unsubscribeAdmins = onSnapshot(
      collection(firebaseDb, 'admins'),
      (snapshot) => {
        const map: Record<string, { email?: string; grantedBy?: string }> = {};
        snapshot.docs.forEach((docItem) => {
          map[docItem.id] = docItem.data() as { email?: string; grantedBy?: string };
        });
        setAdminsMap(map);
      },
      () => {},
    );

    return () => {
      unsubscribeOrders();
      unsubscribeSubscribers();
      unsubscribeUsers();
      unsubscribeAdmins();
    };
  }, []);

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.slug} ${product.categoryLabel}`.toLowerCase().includes(search.toLowerCase()));

  const closeEditor = () => { setEditorOpen(false); setEditing(null); setForm(emptyForm); setError(''); };
  const updateField = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    const name = form.name.trim();
    const slug = slugify(form.slug || name);
    const price = Number(form.price);
    const salePrice = form.salePrice ? Number(form.salePrice) : undefined;
    if (!name || !slug || !Number.isFinite(price) || price < 0 || !form.sizes.split(',').some((size) => size.trim())
      || (salePrice !== undefined && (!Number.isFinite(salePrice) || salePrice > price))
      || form.images.length + form.existingImages.length === 0
      || form.images.length + form.existingImages.length > 12) {
      setError('Kiểm tra tên, đường dẫn, giá, kích cỡ và ảnh. Cần ít nhất 1 ảnh, tối đa 12 ảnh; giá ưu đãi không cao hơn giá gốc.');
      setSaving(false);
      return;
    }

    const gender = form.category === 'men' ? 'men' : form.category === 'women' ? 'women' : 'unisex';
    const productId = editing?.id ?? `novae-${crypto.randomUUID()}`;
    let uploadedStoragePaths: string[] = [];
    try {
      const uploaded = await uploadProductImages(productId, form.images);
      uploadedStoragePaths = uploaded.storagePaths;
      const product: Product = {
        ...(editing ?? {
          id: productId,
          details: [], care: [], colors: [{ name: 'Noir', hex: '#111111' }], rating: 5, reviews: 0,
        }),
        name,
        slug,
        category: form.category,
        categoryLabel: categoryLabels[form.category],
        subcategory: form.subcategory.trim() || 'Shirts',
        gender,
        price,
        salePrice,
        description: form.description.trim(),
        material: form.material.trim() || 'Đang cập nhật',
        badge: salePrice !== undefined ? 'SALE' : form.isBestSeller ? 'BEST SELLER' : form.isNew ? 'NEW' : undefined,
        sizes: form.sizes.split(',').map((size) => size.trim()).filter(Boolean),
        images: [...form.existingImages, ...uploaded.urls],
        inStock: form.inStock,
        isNew: form.isNew,
        isFeatured: form.isFeatured,
        isBestSeller: form.isBestSeller,
      };
      await saveProduct(product, !editing);
      closeEditor();
    } catch (saveError) {
      await deleteUploadedProductImages(uploadedStoragePaths).catch(() => undefined);
      const rawMessage = saveError instanceof Error ? saveError.message : 'Không thể lưu sản phẩm.';
      if (rawMessage.toLowerCase().includes('permission-denied') || rawMessage.toLowerCase().includes('insufficient permissions')) {
        setError('Firestore từ chối quyền ghi: Tài khoản hiện tại chưa được cấp quyền admin trong collection "admins/{uid}".');
      } else {
        setError(rawMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const startCreate = () => { setEditorOpen(true); setEditing(null); setForm(emptyForm); setError(''); };
  const startEdit = (product: Product) => { setEditorOpen(true); setEditing(product); setForm(formFromProduct(product)); setError(''); };

  const addImageFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const selectedFiles = Array.from(files);
    const totalCount = form.existingImages.length + form.images.length + selectedFiles.length;
    if (totalCount > 12) {
      setError(`Tối đa 12 ảnh cho mỗi sản phẩm (hiện đã có ${form.existingImages.length + form.images.length} ảnh).`);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const invalidType = selectedFiles.some((f) => !allowedTypes.includes(f.type));
    if (invalidType) {
      setError('Chỉ chấp nhận định dạng ảnh JPG, PNG, WEBP hoặc GIF.');
      return;
    }

    const tooLarge = selectedFiles.some((f) => f.size > 10 * 1024 * 1024);
    if (tooLarge) {
      setError('Mỗi ảnh dung lượng tối đa 10 MB.');
      return;
    }

    setForm((current) => ({ ...current, images: [...current.images, ...selectedFiles] }));
    setError('');
  };

  const removeExistingImage = (indexToRemove: number) => {
    setForm((current) => ({
      ...current,
      existingImages: current.existingImages.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const removeNewImage = (indexToRemove: number) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addImageFiles(e.dataTransfer.files);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Xóa sản phẩm “${product.name}”?`)) return;
    setError('');
    try {
      await deleteProduct(product.id);
      if (editing?.id === product.id) closeEditor();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Không thể xóa sản phẩm.');
    }
  };

  const handleSeedCatalog = async () => {
    setError('');
    setSeeding(true);
    try {
      await seedDefaultCatalog();
    } catch (seedError) {
      setError(seedError instanceof Error ? seedError.message : 'Không thể nhập catalog mẫu.');
    } finally {
      setSeeding(false);
    }
  };

  const handleOrderStatusChange = async (orderId: string, status: AdminOrder['status']) => {
    if (!firebaseDb) return;
    setManagementError('');
    try {
      await updateDoc(doc(firebaseDb, 'orders', orderId), { status });
    } catch (statusError) {
      setManagementError(statusError instanceof Error ? statusError.message : 'Không cập nhật được trạng thái đơn hàng.');
    }
  };

  const handleGrantAdmin = async (uidToGrant: string, emailToGrant?: string) => {
    if (!firebaseDb || !uidToGrant.trim()) return;
    setManagementError('');
    setAdminActionLoading(true);
    try {
      await setDoc(doc(firebaseDb, 'admins', uidToGrant.trim()), {
        email: emailToGrant?.trim() || '',
        grantedBy: user?.email || user?.id || 'admin',
        createdAt: serverTimestamp(),
      });
      await setDoc(doc(firebaseDb, 'users', uidToGrant.trim()), { role: 'admin' }, { merge: true }).catch(() => undefined);
      setTargetAdminUid('');
      setTargetAdminEmail('');
    } catch (err) {
      setManagementError(err instanceof Error ? err.message : 'Không thể cấp quyền admin.');
    } finally {
      setAdminActionLoading(false);
    }
  };

  const handleRevokeAdmin = async (uidToRevoke: string) => {
    if (!firebaseDb) return;
    if (uidToRevoke === user?.id) {
      alert('Bạn không thể tự gỡ quyền admin của chính mình.');
      return;
    }
    if (!window.confirm(`Xác nhận thu hồi quyền Quản trị viên của UID: ${uidToRevoke}?`)) return;
    setManagementError('');
    setAdminActionLoading(true);
    try {
      await deleteDoc(doc(firebaseDb, 'admins', uidToRevoke));
      await setDoc(doc(firebaseDb, 'users', uidToRevoke), { role: 'customer' }, { merge: true }).catch(() => undefined);
    } catch (err) {
      setManagementError(err instanceof Error ? err.message : 'Không thể gỡ quyền admin.');
    } finally {
      setAdminActionLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUid(text);
    setTimeout(() => setCopiedUid(null), 2000);
  };

  const downloadSubscribersCsv = () => {
    const escapeCsv = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const csv = ['Email,Trạng thái,Ngày đăng ký', ...subscribers.map((subscriber) =>
      [subscriber.email, subscriber.status, formatDate(subscriber.createdAt)].map(escapeCsv).join(','),
    )].join('\r\n');
    const fileUrl = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
    const downloadLink = document.createElement('a');
    downloadLink.href = fileUrl;
    downloadLink.download = 'hv-clothing-newsletter-subscribers.csv';
    downloadLink.click();
    URL.revokeObjectURL(fileUrl);
  };

  return (
    <main className="min-h-[80vh] bg-[#F5F5F2] px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        {!firebaseConfigured && (
          <p role="alert" className="mb-5 border border-[#E6D5A8] bg-[#FFF9E9] px-4 py-3 text-xs text-[#715B20]">
            Firebase chưa được cấu hình. Tạo file .env từ .env.example, điền Firebase Web App config rồi khởi động lại ứng dụng.
          </p>
        )}
        <header className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-[#DADAD4] pb-5">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#6E7771]">HV CLOTHING / QUẢN TRỊ</p>
            <h1 className="font-serif text-3xl text-[#202722]">
              {activeTab === 'products' ? 'Sản phẩm' : activeTab === 'orders' ? 'Đơn hàng' : activeTab === 'subscribers' ? 'Email đăng ký' : 'Tài khoản & Admin'}
            </h1>
            <p className="mt-1 text-xs text-[#737873]">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === 'products' && (
              <button type="button" onClick={startCreate}
                className="inline-flex h-10 items-center gap-2 bg-[#263C36] px-4 text-xs font-medium tracking-wide text-white hover:bg-[#192A25]">
                <PackagePlus size={16} aria-hidden="true" /> Thêm sản phẩm
              </button>
            )}
            {activeTab === 'subscribers' && subscribers.length > 0 && (
              <button type="button" onClick={downloadSubscribersCsv}
                className="inline-flex h-10 items-center gap-2 border border-[#D4D5CE] px-4 text-xs font-medium text-[#404842] hover:bg-white">
                Tải CSV
              </button>
            )}
            <button
              type="button"
              onClick={() => { void logout(); }}
              aria-label="Đăng xuất tài khoản"
              className="inline-flex h-10 items-center gap-2 border border-[#D4D5CE] bg-white px-3.5 text-xs font-medium text-rose-700 hover:bg-rose-50 hover:border-rose-300 transition-colors"
              title="Đăng xuất tài khoản"
            >
              <LogOut size={15} aria-hidden="true" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        <nav aria-label="Quản lý dữ liệu" className="mb-6 flex gap-1 border-b border-[#DADAD4] overflow-x-auto">
          {([
            ['products', 'Sản phẩm', PackagePlus],
            ['orders', `Đơn hàng${orders.length ? ` (${orders.length})` : ''}`, ShoppingBag],
            ['subscribers', `Email đăng ký${subscribers.length ? ` (${subscribers.length})` : ''}`, Mail],
            ['users', `Tài khoản & Admin${registeredUsers.length ? ` (${registeredUsers.length})` : ''}`, Users],
          ] as const).map(([tab, label, Icon]) => (
            <button key={tab} type="button" onClick={() => { setActiveTab(tab); setEditorOpen(false); }}
              aria-current={activeTab === tab ? 'page' : undefined}
              className={`inline-flex min-h-11 items-center gap-2 border-b-2 px-4 text-xs shrink-0 ${activeTab === tab ? 'border-[#263C36] font-medium text-[#263C36]' : 'border-transparent text-[#707771] hover:text-[#263C36]'}`}>
              <Icon size={15} aria-hidden="true" /> {label}
            </button>
          ))}
        </nav>

        {managementError && (
          <p role="alert" className="mb-4 border border-[#E8C9C5] bg-[#FFF7F5] px-3 py-2 text-xs text-[#963E35]">{managementError}</p>
        )}

        {activeTab === 'products' && <div className={`grid gap-8 ${editorOpen ? 'xl:grid-cols-[minmax(0,1fr)_420px]' : ''}`}>
          <section className="min-w-0">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#404842]">Danh mục sản phẩm</h2>
              <label className="relative block w-full max-w-xs">
                <span className="sr-only">Tìm sản phẩm</span>
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777]" aria-hidden="true" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm sản phẩm"
                  className="h-10 w-full border border-[#DADAD4] bg-white pl-9 pr-3 text-xs outline-none focus:border-[#263C36]" />
              </label>
            </div>

            {error && <p role="alert" className="mb-3 border border-[#E8C9C5] bg-[#FFF7F5] px-3 py-2 text-xs text-[#963E35]">{error}</p>}
            {firebaseConfigured && !loading && products.length === 0 && !catalogError && (
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border border-[#DADAD4] bg-white px-4 py-3">
                <p className="text-xs text-[#606861]">Firestore chưa có sản phẩm. Có thể nhập catalog mẫu gồm {PRODUCTS.length} sản phẩm.</p>
                <button type="button" onClick={() => void handleSeedCatalog()} disabled={seeding}
                  className="inline-flex min-h-9 items-center gap-2 bg-[#263C36] px-3 text-xs text-white hover:bg-[#192A25] disabled:opacity-60">
                  <Database size={14} aria-hidden="true" /> {seeding ? 'ĐANG NHẬP...' : 'NHẬP CATALOG MẪU'}
                </button>
              </div>
            )}
            <div className="overflow-x-auto border border-[#DADAD4] bg-white">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead className="bg-[#ECEDE8] text-[10px] uppercase tracking-[0.12em] text-[#606861]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Sản phẩm</th>
                    <th className="px-4 py-3 font-medium">Danh mục</th>
                    <th className="px-4 py-3 font-medium">Giá</th>
                    <th className="px-4 py-3 font-medium">Tình trạng</th>
                    <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECEDE8]">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="text-xs text-[#343A35]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.images[0]} alt="" className="h-14 w-11 object-cover" />
                          <div><p className="font-medium">{product.name}</p><p className="mt-1 text-[10px] text-[#838983]">{product.slug}</p></div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{product.categoryLabel}</td>
                      <td className="px-4 py-3"><span className="font-medium">{formatPrice(product.salePrice ?? product.price)}</span>
                        {product.salePrice !== undefined && <span className="ml-2 text-[10px] text-[#888] line-through">{formatPrice(product.price)}</span>}
                      </td>
                      <td className="px-4 py-3"><span className={product.inStock ? 'text-[#37634B]' : 'text-[#9B4841]'}>{product.inStock ? 'Còn hàng' : 'Hết hàng'}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button type="button" onClick={() => startEdit(product)} aria-label={`Sửa ${product.name}`} title="Sửa sản phẩm"
                            className="flex h-8 w-8 items-center justify-center text-[#58625A] hover:bg-[#F0F1EC]"><Pencil size={15} aria-hidden="true" /></button>
                          <button type="button" onClick={() => void handleDelete(product)} aria-label={`Xóa ${product.name}`} title="Xóa sản phẩm"
                            className="flex h-8 w-8 items-center justify-center text-[#8D4943] hover:bg-[#FBF0ED]"><Trash2 size={15} aria-hidden="true" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loading && <p className="px-4 py-4 text-xs text-[#777]">Đang tải dữ liệu...</p>}
              {!loading && filteredProducts.length === 0 && <p className="px-4 py-10 text-center text-xs text-[#777]">Không tìm thấy sản phẩm.</p>}
            </div>
          </section>

          {editorOpen && (
            <aside className="h-fit border border-[#DADAD4] bg-white p-5">
              <div className="mb-5 flex items-center justify-between border-b border-[#E5E6E0] pb-3">
                <h2 className="font-serif text-xl text-[#202722]">{editing ? 'Chỉnh sửa sản phẩm' : 'Sản phẩm mới'}</h2>
                <button type="button" onClick={closeEditor} aria-label="Đóng biểu mẫu" className="p-1 text-[#656D67] hover:text-black">
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
              <form onSubmit={handleSave} className="space-y-3.5">
                <div><label htmlFor="product-name" className="mb-1 block text-[11px] text-[#555]">Tên sản phẩm</label>
                  <input id="product-name" required maxLength={160} value={form.name} onChange={(event) => updateField('name', event.target.value)} className="admin-input" /></div>
                <div><label htmlFor="product-slug" className="mb-1 block text-[11px] text-[#555]">Đường dẫn</label>
                  <input id="product-slug" value={form.slug} onChange={(event) => updateField('slug', event.target.value)} placeholder="Tự tạo theo tên" className="admin-input" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label htmlFor="product-category" className="mb-1 block text-[11px] text-[#555]">Danh mục</label>
                    <select id="product-category" value={form.category} onChange={(event) => updateField('category', event.target.value as ProductCategory)} className="admin-input">
                      <option value="women">Thời Trang Nữ</option><option value="men">Thời Trang Nam</option><option value="accessories">Phụ Kiện</option><option value="collections">Bộ Sưu Tập</option>
                    </select></div>
                  <div><label htmlFor="product-subcategory" className="mb-1 block text-[11px] text-[#555]">Loại sản phẩm</label>
                    <input id="product-subcategory" value={form.subcategory} onChange={(event) => updateField('subcategory', event.target.value)} className="admin-input" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label htmlFor="product-price" className="mb-1 block text-[11px] text-[#555]">Giá (VND)</label>
                    <input id="product-price" type="number" required min="0" step="1000" value={form.price} onChange={(event) => updateField('price', event.target.value)} className="admin-input" /></div>
                  <div><label htmlFor="product-sale-price" className="mb-1 block text-[11px] text-[#555]">Giá ưu đãi</label>
                    <input id="product-sale-price" type="number" min="0" step="1000" value={form.salePrice} onChange={(event) => updateField('salePrice', event.target.value)} className="admin-input" /></div>
                </div>
                <div><label htmlFor="product-description" className="mb-1 block text-[11px] text-[#555]">Mô tả</label>
                  <textarea id="product-description" rows={3} value={form.description} onChange={(event) => updateField('description', event.target.value)} className="admin-input resize-y" /></div>
                <div><label htmlFor="product-material" className="mb-1 block text-[11px] text-[#555]">Chất liệu</label>
                  <input id="product-material" value={form.material} onChange={(event) => updateField('material', event.target.value)} className="admin-input" /></div>
                <div><label htmlFor="product-sizes" className="mb-1 block text-[11px] text-[#555]">Kích cỡ, cách nhau bằng dấu phẩy</label>
                  <input id="product-sizes" required value={form.sizes} onChange={(event) => updateField('sizes', event.target.value)} className="admin-input" /></div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-[11px] font-medium text-[#555]">
                      Hình ảnh sản phẩm (tải từ máy)
                    </label>
                    <span className="text-[10px] text-[#777]">
                      {form.existingImages.length + form.images.length}/12 ảnh
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    id="product-images-input"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={(event) => {
                      addImageFiles(event.target.files);
                      event.target.value = '';
                    }}
                    className="hidden"
                  />

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed p-4 text-center transition-colors ${
                      isDragging
                        ? 'border-[#263C36] bg-[#263C36]/5'
                        : 'border-[#DADAD4] bg-[#FAFAF8] hover:border-[#263C36] hover:bg-[#F4F4F0]'
                    }`}
                  >
                    <ImagePlus size={24} className="mb-2 text-[#5E6660]" aria-hidden="true" />
                    <p className="text-xs font-medium text-[#2E3630]">
                      Nhấn để chọn ảnh từ máy hoặc kéo thả vào đây
                    </p>
                    <p className="mt-1 text-[10px] text-[#7E8580]">
                      Hỗ trợ PNG, JPG, WEBP, GIF (tối đa 10 MB / ảnh, 1 - 12 ảnh)
                    </p>
                  </div>

                  {(form.existingImages.length > 0 || form.images.length > 0) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.existingImages.map((url, idx) => (
                        <div
                          key={`existing-${idx}`}
                          className="group relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border border-[#DADAD4] bg-[#F7F7F5]"
                        >
                          <img src={url} alt={`Ảnh ${idx + 1}`} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeExistingImage(idx);
                            }}
                            aria-label={`Xóa ảnh ${idx + 1}`}
                            title="Xóa ảnh này"
                            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/75 text-white opacity-90 transition-opacity hover:bg-black group-hover:opacity-100"
                          >
                            <X size={12} aria-hidden="true" />
                          </button>
                          <span className="absolute inset-x-0 bottom-0 truncate bg-[#263C36]/85 px-0.5 text-center text-[8px] text-white">
                            Đã lưu
                          </span>
                        </div>
                      ))}
                      {form.images.map((file, idx) => (
                        <FileThumbnail
                          key={`new-${file.name}-${idx}`}
                          file={file}
                          onRemove={() => removeNewImage(idx)}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <fieldset className="grid grid-cols-2 gap-2 py-1 text-xs text-[#4E554F]">
                  {([
                    ['inStock', 'Còn hàng'], ['isNew', 'Hàng mới'], ['isFeatured', 'Nổi bật'], ['isBestSeller', 'Bán chạy'],
                  ] as const).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2"><input type="checkbox" checked={form[key]} onChange={(event) => updateField(key, event.target.checked)} />{label}</label>
                  ))}
                </fieldset>
                {error && <p role="alert" className="text-xs text-[#A43131]">{error}</p>}
                <button type="submit" disabled={saving} className="min-h-11 w-full bg-[#263C36] px-4 text-xs font-medium tracking-[0.12em] text-white hover:bg-[#192A25] disabled:opacity-60">
                  {saving ? 'ĐANG LƯU...' : editing ? 'LƯU THAY ĐỔI' : 'TẠO SẢN PHẨM'}
                </button>
              </form>
            </aside>
          )}
        </div>}

        {activeTab === 'orders' && (
          <section className="overflow-x-auto border border-[#DADAD4] bg-white">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead className="bg-[#ECEDE8] text-[10px] uppercase tracking-[0.12em] text-[#606861]">
                <tr>
                  <th className="px-4 py-3 font-medium">Mã / Ngày đặt</th>
                  <th className="px-4 py-3 font-medium">Khách hàng</th>
                  <th className="px-4 py-3 font-medium">Sản phẩm</th>
                  <th className="px-4 py-3 font-medium">Thanh toán</th>
                  <th className="px-4 py-3 font-medium">Tổng tiền</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEDE8]">
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="text-xs text-[#343A35]">
                      <td className="px-4 py-3"><p className="font-mono font-medium">{order.orderCode}</p><p className="mt-1 text-[10px] text-[#838983]">{formatDate(order.createdAt)}</p></td>
                      <td className="px-4 py-3"><p className="font-medium">{order.customer?.fullName}</p><p className="mt-1">{order.customer?.email}</p><p className="mt-1 text-[#777]">{order.customer?.phone}</p></td>
                      <td className="px-4 py-3">{order.items?.length ?? 0} mặt hàng
                        <button type="button" onClick={() => setExpandedOrderId((current) => current === order.id ? null : order.id)} className="ml-2 text-[#37634B] underline underline-offset-2">
                          {expandedOrderId === order.id ? 'Ẩn chi tiết' : 'Chi tiết'}
                        </button>
                      </td>
                      <td className="px-4 py-3">{paymentMethodLabels[order.paymentMethod] ?? order.paymentMethod}</td>
                      <td className="px-4 py-3 font-medium">{formatPrice(order.total ?? 0)}</td>
                      <td className="px-4 py-3">
                        <select aria-label={`Trạng thái đơn ${order.orderCode}`} value={order.status}
                          onChange={(event) => void handleOrderStatusChange(order.id, event.target.value as AdminOrder['status'])}
                          className="min-h-9 border border-[#DADAD4] bg-white px-2 text-xs">
                          {Object.entries(orderStatusLabels).map(([status, statusLabel]) => <option key={status} value={status}>{statusLabel}</option>)}
                        </select>
                      </td>
                    </tr>
                    {expandedOrderId === order.id && (
                      <tr className="bg-[#FAFAF7] text-xs text-[#4E554F]"><td colSpan={6} className="px-4 py-4">
                        <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
                          <div><h3 className="mb-2 font-semibold">Địa chỉ nhận hàng</h3><p>{order.shipping?.address}, {order.shipping?.ward}, {order.shipping?.district}, {order.shipping?.city}</p><p className="mt-1">Email: {order.customer?.email} · Điện thoại: {order.customer?.phone}</p></div>
                          <div><h3 className="mb-2 font-semibold">Chi tiết mặt hàng</h3><ul className="space-y-1">{order.items?.map((item, index) => <li key={`${item.productId}-${index}`}>{item.name} · {item.size}/{item.color} · SL {item.quantity} · {formatPrice(item.lineTotal)}</li>)}</ul><p className="mt-2">Tạm tính {formatPrice(order.subtotal)} · Giảm {formatPrice(order.discount)} · Ship {formatPrice(order.shippingFee)}</p></div>
                        </div>
                      </td></tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            {ordersLoading && <p className="px-4 py-4 text-xs text-[#777]">Đang tải đơn hàng...</p>}
            {!ordersLoading && orders.length === 0 && <p className="px-4 py-12 text-center text-xs text-[#777]">Chưa có đơn hàng nào.</p>}
          </section>
        )}

        {activeTab === 'subscribers' && (
          <section className="overflow-x-auto border border-[#DADAD4] bg-white">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead className="bg-[#ECEDE8] text-[10px] uppercase tracking-[0.12em] text-[#606861]"><tr><th className="px-4 py-3 font-medium">Email</th><th className="px-4 py-3 font-medium">Nguồn đăng ký</th><th className="px-4 py-3 font-medium">Ngày đăng ký</th><th className="px-4 py-3 font-medium">Trạng thái</th></tr></thead>
              <tbody className="divide-y divide-[#ECEDE8]">{subscribers.map((subscriber) => <tr key={subscriber.id} className="text-xs text-[#343A35]"><td className="px-4 py-3 font-medium">{subscriber.email}</td><td className="px-4 py-3">Website newsletter</td><td className="px-4 py-3">{formatDate(subscriber.createdAt)}</td><td className="px-4 py-3"><span className={subscriber.status === 'subscribed' ? 'text-[#37634B]' : 'text-[#9B4841]'}>{subscriber.status === 'subscribed' ? 'Đang đăng ký' : 'Đã hủy'}</span></td></tr>)}</tbody>
            </table>
            {subscribersLoading && <p className="px-4 py-4 text-xs text-[#777]">Đang tải email đăng ký...</p>}
            {!subscribersLoading && subscribers.length === 0 && <p className="px-4 py-12 text-center text-xs text-[#777]">Chưa có email đăng ký nào.</p>}
          </section>
        )}

        {activeTab === 'users' && (
          <section className="space-y-6">
            {/* Quick guide card */}
            <div className="border border-[#E2E0DB] bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ECEBE6] pb-3">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#263C36]">Quản lý Tài khoản &amp; Phân quyền Admin</h3>
                  <p className="mt-1 text-xs text-[#666]">Mọi người dùng khi tạo tài khoản đều được lưu tại Firebase Authentication. Quyền Admin được xác định qua danh sách UID trong collection <code className="bg-[#F0F1EC] px-1.5 py-0.5 font-mono text-[11px]">admins/&#123;uid&#125;</code>.</p>
                </div>
                <a
                  href="https://console.firebase.google.com/project/hv-clothings/authentication/users"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#263C36] px-3.5 py-2 text-xs font-medium text-white hover:bg-[#192A25]"
                >
                  Mở Firebase Auth Console <ExternalLink size={13} />
                </a>
              </div>

              {/* Form to grant admin rights */}
              <form onSubmit={(e) => { e.preventDefault(); void handleGrantAdmin(targetAdminUid, targetAdminEmail); }} className="mt-4 grid gap-3 sm:grid-cols-[1.5fr_1.5fr_auto] items-end">
                <div>
                  <label htmlFor="grant-uid" className="mb-1 block text-[11px] text-[#555]">User UID (Mã định danh người dùng)</label>
                  <input
                    id="grant-uid"
                    required
                    placeholder="VD: dJ3k92La1..."
                    value={targetAdminUid}
                    onChange={(e) => setTargetAdminUid(e.target.value)}
                    className="admin-input font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="grant-email" className="mb-1 block text-[11px] text-[#555]">Email người dùng (tùy chọn để ghi nhớ)</label>
                  <input
                    id="grant-email"
                    type="email"
                    placeholder="email@example.com"
                    value={targetAdminEmail}
                    onChange={(e) => setTargetAdminEmail(e.target.value)}
                    className="admin-input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={adminActionLoading || !targetAdminUid.trim()}
                  className="inline-flex min-h-[38px] items-center justify-center gap-1.5 bg-[#263C36] px-4 text-xs font-medium tracking-wider text-white hover:bg-[#192A25] disabled:opacity-60"
                >
                  <ShieldCheck size={14} />
                  CẤP QUYỀN ADMIN
                </button>
              </form>
            </div>

            {/* List of Registered Users */}
            <div className="overflow-x-auto border border-[#DADAD4] bg-white">
              <div className="border-b border-[#ECEBE6] px-4 py-3 bg-[#FAFAF8]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#404842]">
                  Danh sách thành viên đăng ký qua Website ({registeredUsers.length})
                </h4>
              </div>
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead className="bg-[#ECEDE8] text-[10px] uppercase tracking-[0.12em] text-[#606861]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Người dùng</th>
                    <th className="px-4 py-3 font-medium">User UID</th>
                    <th className="px-4 py-3 font-medium">Vai trò</th>
                    <th className="px-4 py-3 font-medium">Ngày đăng ký</th>
                    <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECEDE8]">
                  {registeredUsers.map((regUser) => {
                    const isAccountAdmin = Boolean(adminsMap[regUser.uid]) || regUser.role === 'admin';
                    const isSelf = regUser.uid === user?.id;
                    return (
                      <tr key={regUser.uid} className="text-xs text-[#343A35]">
                        <td className="px-4 py-3">
                          <p className="font-medium">{regUser.name || 'Chưa đặt tên'}</p>
                          <p className="mt-0.5 text-[11px] text-[#777]">{regUser.email}</p>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-[#555]">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate max-w-[150px]">{regUser.uid}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(regUser.uid)}
                              className="text-[#777] hover:text-black"
                              title="Sao chép UID"
                            >
                              {copiedUid === regUser.uid ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase rounded ${
                              isAccountAdmin ? 'bg-[#263C36] text-white' : 'bg-[#EAEAEA] text-[#555]'
                            }`}
                          >
                            {isAccountAdmin ? 'Quản trị viên' : 'Khách hàng'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-[#777]">
                          {formatDate(regUser.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {isSelf ? (
                            <span className="text-[11px] text-[#888] italic">Đang đăng nhập</span>
                          ) : isAccountAdmin ? (
                            <button
                              type="button"
                              onClick={() => void handleRevokeAdmin(regUser.uid)}
                              disabled={adminActionLoading}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 hover:underline"
                            >
                              <UserX size={13} /> Gỡ quyền Admin
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => void handleGrantAdmin(regUser.uid, regUser.email)}
                              disabled={adminActionLoading}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#263C36] hover:underline"
                            >
                              <Shield size={13} /> Thăng cấp Admin
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {usersLoading && <p className="px-4 py-4 text-xs text-[#777]">Đang tải danh sách thành viên...</p>}
              {!usersLoading && registeredUsers.length === 0 && (
                <div className="px-4 py-10 text-center text-xs text-[#777]">
                  <p>Chưa có tài khoản nào được ghi nhận từ website.</p>
                  <p className="mt-1 text-[11px] text-[#999]">Bạn có thể nhập UID trực tiếp ở khung bên trên hoặc mở Firebase Auth Console để copy UID tài khoản muốn cấp quyền.</p>
                </div>
              )}
            </div>

            {/* List of all Active Admins in Firestore */}
            <div className="overflow-x-auto border border-[#DADAD4] bg-white">
              <div className="border-b border-[#ECEBE6] px-4 py-3 bg-[#FAFAF8] flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#404842]">
                  Danh sách Quản trị viên hiện tại ({Object.keys(adminsMap).length})
                </h4>
              </div>
              <table className="w-full min-w-[600px] border-collapse text-left">
                <thead className="bg-[#ECEDE8] text-[10px] uppercase tracking-[0.12em] text-[#606861]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Admin UID</th>
                    <th className="px-4 py-3 font-medium">Email / Ghi chú</th>
                    <th className="px-4 py-3 font-medium">Người cấp</th>
                    <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECEDE8]">
                  {Object.entries(adminsMap).map(([adminUid, adminData]) => (
                    <tr key={adminUid} className="text-xs text-[#343A35]">
                      <td className="px-4 py-3 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-[#263C36]">{adminUid}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(adminUid)}
                            className="text-[#777] hover:text-black"
                            title="Sao chép UID"
                          >
                            {copiedUid === adminUid ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#555]">{adminData.email || 'Chưa ghi chú'}</td>
                      <td className="px-4 py-3 text-[#777]">{adminData.grantedBy || 'Hệ thống'}</td>
                      <td className="px-4 py-3 text-right">
                        {adminUid === user?.id ? (
                          <span className="text-[11px] text-[#888] italic">Tài khoản của bạn</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => void handleRevokeAdmin(adminUid)}
                            disabled={adminActionLoading}
                            className="text-[11px] font-medium text-rose-700 hover:underline"
                          >
                            Gỡ quyền Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {Object.keys(adminsMap).length === 0 && (
                <p className="px-4 py-8 text-center text-xs text-[#777]">Chưa có dữ liệu admin trong collection admins. Hãy thêm admin đầu tiên bằng ô phía trên.</p>
              )}
            </div>
          </section>
        )}
      </div>
      <style>{`.admin-input{width:100%;min-height:38px;border:1px solid #d9dad4;background:#fff;padding:8px 10px;font-size:12px;color:#303832;outline:none}.admin-input:focus{border-color:#263c36}`}</style>
    </main>
  );
};