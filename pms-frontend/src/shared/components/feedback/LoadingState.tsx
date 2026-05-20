type Props = { message?: string };

export function LoadingState({ message = "Đang tải..." }: Props) {
  return <p className="text-center text-slate-500">{message}</p>;
}
