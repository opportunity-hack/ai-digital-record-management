import Spinner from "@/components/common/loading-spinner";

type AccountButtonParameters = {
  text?: string;
  disabled?: boolean;
};

export default function AccountButton({ text, disabled }: AccountButtonParameters) {
  return (
    <button className="mt-4 flex h-12 w-full max-w-lg items-center justify-center rounded-md bg-pc px-2 font-bold text-bg outline-1 outline-black " type="submit" disabled={disabled}>
      {disabled ? <Spinner /> : text}
    </button>
  );
}
