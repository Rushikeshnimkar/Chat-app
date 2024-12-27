import { useDarkMode } from '../../context/DarkModeContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}>
      {children}
    </div>
  );
}; 