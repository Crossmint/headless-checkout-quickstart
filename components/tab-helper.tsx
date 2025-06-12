interface TabHelperProps {
  title: string;
  children: React.ReactNode;
}

export const TabHelper: React.FC<TabHelperProps> = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h3 className="text-white text-sm font-semibold mb-3">{title}</h3>
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <div className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white backdrop-blur-lg cursor-not-allowed text-lg tracking-wider opacity-70">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
