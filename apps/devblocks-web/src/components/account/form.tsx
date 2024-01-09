export default function AccountForm({ children, onSubmit }: { children: React.ReactNode; onSubmit?: any }) {
  return (
    <form className="flex w-full max-w-md flex-col items-center rounded-lg p-4 sm:border-[1px] sm:border-pt sm:bg-white sm:shadow-[0rem_0.5rem_var(--color-primary-text)]" onSubmit={onSubmit}>
      {children}
    </form>
  );
}
