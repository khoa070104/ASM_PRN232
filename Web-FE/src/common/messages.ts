export const Messages = {
  LoadFailed: 'Không thể tải dữ liệu',
  CreateSuccess: 'Thêm sản phẩm thành công!',
  UpdateSuccess: 'Cập nhật sản phẩm thành công!',
  DeleteSuccess: 'Xoá sản phẩm thành công!',
  DeleteFailed: 'Xoá sản phẩm thất bại!',
  GeneralError: 'Có lỗi xảy ra, vui lòng thử lại.',
} as const;

export type MessageKey = keyof typeof Messages;
