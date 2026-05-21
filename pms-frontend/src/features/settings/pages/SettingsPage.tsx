import { type FormEvent, useEffect, useState } from "react";
import { ApiClientError } from "@/shared/api/client";
import { ErrorAlert } from "@/shared/components/feedback/ErrorAlert";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/Button";
import { authApi } from "@/features/auth/api/authApi";
import { useAuth } from "@/shared/context/AuthContext";
import { useToast } from "@/shared/context/ToastContext";

export function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [username, setUsername] = useState(user?.username ?? "");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  useEffect(() => {
    if (user?.username) setUsername(user.username);
  }, [user?.username]);

  async function handleProfile(e: FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg("");
    setProfileErr("");
    try {
      await authApi.updateProfile({ username });
      await refreshUser();
      setProfileMsg("");
      toast.success("Đã cập nhật hồ sơ thành công");
    } catch (err) {
      setProfileErr(err instanceof ApiClientError ? err.message : "Cập nhật thất bại");
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePassword(e: FormEvent) {
    e.preventDefault();
    setPwdLoading(true);
    setPwdMsg("");
    setPwdErr("");
    try {
      await authApi.changePassword({ currentPassword, newPassword, confirmNewPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setPwdMsg("");
      toast.success("Đã đổi mật khẩu thành công");
    } catch (err) {
      setPwdErr(err instanceof ApiClientError ? err.message : "Đổi mật khẩu thất bại");
    } finally {
      setPwdLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Cài đặt tài khoản"
        description="Cập nhật hồ sơ và mật khẩu đăng nhập."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={handleProfile}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">Hồ sơ</h2>
          <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
          {profileErr && <ErrorAlert message={profileErr} className="mt-4" />}
          {profileMsg && (
            <p className="mt-4 text-sm text-green-700">{profileMsg}</p>
          )}
          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700">Tên hiển thị</span>
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <Button type="submit" className="mt-4" disabled={profileLoading}>
            {profileLoading ? "Đang lưu…" : "Lưu hồ sơ"}
          </Button>
        </form>

        <form
          onSubmit={handlePassword}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">Đổi mật khẩu</h2>
          {pwdErr && <ErrorAlert message={pwdErr} className="mt-4" />}
          {pwdMsg && <p className="mt-4 text-sm text-green-700">{pwdMsg}</p>}
          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700">Mật khẩu hiện tại</span>
            <input
              required
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="mt-3 block">
            <span className="text-sm font-medium text-slate-700">Mật khẩu mới</span>
            <input
              required
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="mt-3 block">
            <span className="text-sm font-medium text-slate-700">Xác nhận mật khẩu mới</span>
            <input
              required
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <Button type="submit" className="mt-4" disabled={pwdLoading}>
            {pwdLoading ? "Đang đổi…" : "Đổi mật khẩu"}
          </Button>
        </form>
      </div>
    </>
  );
}
