import React from 'react';
import { Clock, CheckCircle2, Package, Truck, Sparkles, AlertCircle } from 'lucide-react';

export type OrderStatus = 'new' | 'confirmed' | 'packing' | 'shipped' | 'completed' | 'cancelled';

export interface OrderStatusConfig {
  label: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, OrderStatusConfig> = {
  new: {
    label: 'Mới đặt',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    borderColor: 'border-amber-200',
    icon: Clock,
    description: 'Đơn hàng đã được tiếp nhận và đang chờ quản trị viên duyệt.',
  },
  confirmed: {
    label: 'Đã xác nhận',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-800',
    borderColor: 'border-blue-200',
    icon: CheckCircle2,
    description: 'HV CLOTHING đã duyệt đơn hàng và chuyển sang xưởng chuẩn bị kiện hàng.',
  },
  packing: {
    label: 'Đang chuẩn bị',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-800',
    borderColor: 'border-indigo-200',
    icon: Package,
    description: 'Xưởng may đang kiểm tra chất lượng và đóng gói vào hộp quà boutique.',
  },
  shipped: {
    label: 'Đang giao hàng',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-800',
    borderColor: 'border-purple-200',
    icon: Truck,
    description: 'Kiện hàng đã giao cho đối tác vận chuyển và đang trên đường tới bạn.',
  },
  completed: {
    label: 'Giao thành công',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    borderColor: 'border-emerald-200',
    icon: Sparkles,
    description: 'Đơn hàng đã được giao thành công. Chúc quý khách mặc đẹp cùng HV CLOTHING!',
  },
  cancelled: {
    label: 'Đã hủy',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-800',
    borderColor: 'border-rose-200',
    icon: AlertCircle,
    description: 'Đơn hàng đã bị hủy. Vui lòng liên hệ bộ phận hỗ trợ nếu cần giải đáp.',
  },
};

const STEP_ORDER: OrderStatus[] = ['new', 'confirmed', 'packing', 'shipped', 'completed'];

export const OrderStatusBadge: React.FC<{ status: OrderStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  const cfg = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.new;
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-none ${cfg.badgeBg} ${cfg.badgeText} ${cfg.borderColor} ${className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{cfg.label}</span>
    </span>
  );
};

export const OrderProgressTimeline: React.FC<{ status: OrderStatus }> = ({ status }) => {
  if (status === 'cancelled') {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 flex items-start gap-3 my-4">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-semibold text-rose-900 uppercase tracking-wider">
            Đơn hàng đã bị hủy
          </h4>
          <p className="text-xs text-rose-700 font-light mt-0.5">
            {ORDER_STATUS_CONFIG.cancelled.description}
          </p>
        </div>
      </div>
    );
  }

  const currentStepIndex = STEP_ORDER.indexOf(status);

  return (
    <div className="py-5 my-2">
      {/* Timeline Steps Bar */}
      <div className="relative">
        {/* Track Line Background */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#E5E5E0] -z-0" />
        {/* Track Line Active Progress */}
        <div
          className="absolute top-4 left-6 h-0.5 bg-[#263C36] transition-all duration-500 -z-0"
          style={{
            width: `${Math.min(100, (Math.max(0, currentStepIndex) / (STEP_ORDER.length - 1)) * 100)}%`,
          }}
        />

        {/* Steps */}
        <div className="relative z-10 flex justify-between">
          {STEP_ORDER.map((stepKey, idx) => {
            const stepCfg = ORDER_STATUS_CONFIG[stepKey];
            const StepIcon = stepCfg.icon;
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={stepKey} className="flex flex-col items-center text-center max-w-[80px] sm:max-w-[100px]">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                    isCurrent
                      ? 'bg-[#263C36] text-white border-[#263C36] ring-4 ring-[#263C36]/15 scale-110 shadow-sm'
                      : isCompleted
                      ? 'bg-[#263C36] text-white border-[#263C36]'
                      : 'bg-white text-[#999] border-[#D4D5CE]'
                  }`}
                >
                  <StepIcon className="w-4 h-4" />
                </div>
                <span
                  className={`mt-2 text-[10px] sm:text-[11px] uppercase tracking-wider transition-colors ${
                    isCurrent
                      ? 'font-semibold text-[#263C36]'
                      : isCompleted
                      ? 'font-medium text-[#111]'
                      : 'text-[#888] font-light'
                  }`}
                >
                  {stepCfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Description Card */}
      <div className="mt-6 p-3.5 bg-[#F9F9F7] border border-[#ECEBE6] text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-[#263C36] font-medium tracking-wide">
            Trạng thái hiện tại: {ORDER_STATUS_CONFIG[status]?.label || 'Đang cập nhật'}
          </span>
        </div>
        <p className="mt-1 text-[#666] font-light text-[11px] leading-relaxed pl-4">
          {ORDER_STATUS_CONFIG[status]?.description}
        </p>
      </div>
    </div>
  );
};
