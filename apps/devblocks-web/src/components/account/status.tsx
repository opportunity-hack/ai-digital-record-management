import ErrorIcon from "@mui/icons-material/Error";

type AccountStatusParameters = {
  text?: string;
};

export default function AccountStatus({ text }: AccountStatusParameters) {
  return (
    <span className={text === "" ? "hidden" : "mt-4 flex w-full items-center justify-center space-x-2 rounded bg-[#FEF1F3] p-2 font-semibold text-[#5D0915]"}>
      <ErrorIcon />
      <span>{text}</span>
    </span>
  );
}
