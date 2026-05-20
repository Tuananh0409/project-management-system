import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiClientError } from "@/shared/api/client";
import { Button } from "@/shared/components/ui/Button";
import { notifyWorkspacesChanged } from "@/shared/events/appEvents";
import { invitationApi } from "../api/invitationApi";

export function AcceptInvitationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;
    invitationApi
      .accept(token)
      .then((ws) => {
        setStatus("ok");
        setMessage(`Đã tham gia workspace "${ws.name}"`);
        notifyWorkspacesChanged({ workspaceId: ws.id });
        setTimeout(() => navigate(`/workspaces/${ws.id}`), 1500);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err instanceof ApiClientError ? err.message : "Lỗi chấp nhận lời mời",
        );
      });
  }, [token, navigate]);

  return (
    <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      {status === "loading" && (
        <p className="text-slate-600">Đang xử lý lời mời...</p>
      )}
      {status === "ok" && (
        <>
          <p className="text-lg font-medium text-green-700">{message}</p>
          <p className="mt-2 text-sm text-slate-500">Đang chuyển hướng...</p>
        </>
      )}
      {status === "error" && (
        <>
          <p className="text-lg font-medium text-red-700">{message}</p>
          <p className="mt-2 text-sm text-slate-500">
            Đảm bảo chọn user <strong>Member (id 2)</strong> ở góc phải header.
          </p>
          <Link to="/" className="mt-4 inline-block">
            <Button variant="secondary">Về trang chủ</Button>
          </Link>
        </>
      )}
    </div>
  );
}
