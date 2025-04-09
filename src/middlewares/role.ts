import { Request, Response, NextFunction } from "express";

const roleUser = (roles: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!(req as any).user) {
      res
        .status(401)
        .json({ message: "Không có token hoặc token không hợp lệ" });
      return; // Thêm return để dừng luồng khi không có user
    }

    if (!roles.includes((req as any).user.role)) {
      res
        .status(403)
        .json({ message: "Bạn không có quyền thực hiện hành động này" });
      return; // Thêm return để dừng luồng khi quyền không hợp lệ
    }

    next();
  };
};

export default roleUser;
