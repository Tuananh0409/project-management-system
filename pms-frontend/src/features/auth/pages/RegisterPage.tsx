import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiClientError } from "@/shared/api/client";
import { Button } from "@/shared/components/ui/Button";
import { ErrorAlert } from "@/shared/components/feedback/ErrorAlert";
import { useAuth } from "@/shared/context/AuthContext";
import { authApi } from "../api/authApi";

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await authApi.register({
        fullName,
        email,
        password,
        confirmPassword,
      });
      login(user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Đăng ký</h1>
      <p className="mt-1 text-sm text-slate-500">Tạo tài khoản CTEL PM</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && <ErrorAlert message={error} />}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Họ tên</span>
          <input
            required
            maxLength={100}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Mật khẩu</span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Tối thiểu 8 ký tự, hoa + thường + số"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Xác nhận mật khẩu</span>
          <input
            required
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Đã có tài khoản?{" "}
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
