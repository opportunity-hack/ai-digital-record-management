type AccountInputParameters = {
  placeholder?: string;
  value?: string;
  type?: string;
  onChange?: (event: any) => void;
};

export default function AccountInput({ placeholder, value, type, onChange }: AccountInputParameters) {
  return <input className="w-full max-w-lg rounded border-2 border-bc p-2 outline-pc" placeholder={placeholder} type={type} value={value} onChange={onChange} />;
}
