import React, { useState } from 'react';
import { Database, LogOut, PackagePlus, Pencil, Search, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useProducts } from '../context/useProducts';
import { formatPrice, PRODUCTS } from '../data/products';
import type { Product, ProductCategory } from '../types/product';

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
  images: string;
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
}

const emptyForm: ProductForm = {
  name: '', slug: '', category: 'women', subcategory: '', price: '', salePrice: '',
  description: '', material: '', sizes: 'S, M, L', images: '',
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
  images: product.images.join('\n'),
  inStock: product.inStock,
  isNew: Boolean(product.isNew),
  isFeatured: Boolean(product.isFeatured),
  isBestSeller: Boolean(product.isBestSeller),
});

const slugify = (value: string) => value.trim().toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const Admin: React.FC = () => {
  const { user, logout } = useAuth();
  const { products, loading, error: catalogError, firebaseConfigured, saveProduct, deleteProduct, seedDefaultCatalog } = useProducts();
  const [search, setSearch] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

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
    const images = form.images.split('\n').map((image) => image.trim()).filter(Boolean);
    if (!name || !slug || !Number.isFinite(price) || price < 0 || !form.sizes.split(',').some((size) => size.trim())
      || (salePrice !== undefined && (!Number.isFinite(salePrice) || salePrice > price)) || !images.length
      || images.some((image) => !image.startsWith('https://'))) {
      setError('Kiểm tra tên, đường dẫn, giá, kích cỡ và ảnh HTTPS. Giá ưu đãi không được cao hơn giá gốc.');
      setSaving(false);
      return;
    }

    const gender = form.category === 'men' ? 'men' : form.category === 'women' ? 'women' : 'unisex';
    const product: Product = {
      ...(editing ?? {
        id: `novae-${crypto.randomUUID()}`,
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
      images,
      inStock: form.inStock,
      isNew: form.isNew,
      isFeatured: form.isFeatured,
      isBestSeller: form.isBestSeller,
    };

    try {
      await saveProduct(product, !editing);
      closeEditor();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Không thể lưu sản phẩm.');
    } finally {
      setSaving(false);
    }
  };

  const startCreate = () => { setEditorOpen(true); setEditing(null); setForm(emptyForm); setError(''); };
  const startEdit = (product: Product) => { setEditorOpen(true); setEditing(product); setForm(formFromProduct(product)); setError(''); };

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
            <h1 className="font-serif text-3xl text-[#202722]">Sản phẩm</h1>
            <p className="mt-1 text-xs text-[#737873]">{products.length} sản phẩm · {user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={startCreate}
              className="inline-flex h-10 items-center gap-2 bg-[#263C36] px-4 text-xs font-medium tracking-wide text-white hover:bg-[#192A25]">
              <PackagePlus size={16} aria-hidden="true" /> Thêm sản phẩm
            </button>
            <button type="button" onClick={() => { void logout(); }} aria-label="Đăng xuất"
              className="flex h-10 w-10 items-center justify-center border border-[#D4D5CE] text-[#4A514C] hover:bg-white">
              <LogOut size={16} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className={`grid gap-8 ${editorOpen ? 'xl:grid-cols-[minmax(0,1fr)_420px]' : ''}`}>
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
                <div><label htmlFor="product-images" className="mb-1 block text-[11px] text-[#555]">Ảnh HTTPS, mỗi đường dẫn một dòng</label>
                  <textarea id="product-images" required rows={2} value={form.images} onChange={(event) => updateField('images', event.target.value)} className="admin-input resize-y" /></div>
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
        </div>
      </div>
      <style>{`.admin-input{width:100%;min-height:38px;border:1px solid #d9dad4;background:#fff;padding:8px 10px;font-size:12px;color:#303832;outline:none}.admin-input:focus{border-color:#263c36}`}</style>
    </main>
  );
};