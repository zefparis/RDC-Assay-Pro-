import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LogIn, LogOut, Menu, X, Globe, User, Sun, Moon } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';

interface HeaderProps {
  onLoginClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { t, locale, changeLocale } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasClientToken, setHasClientToken] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { key: 'services', href: '/#services', label: t.nav.services },
    { key: 'tracking', href: '/#tracking', label: t.nav.tracking },
    { key: 'submit', href: '/#submit', label: t.nav.submit },
    { key: 'reports', href: '/#reports', label: t.nav.reports },
    { key: 'inspection', href: '/inspection', label: t.nav.inspection || 'Inspection' },
  ];

  const toggleLocale = () => {
    changeLocale(locale === 'fr' ? 'en' : 'fr');
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setHasClientToken(/(?:^|; )clientToken=/.test(document.cookie));
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-secondary-950/70 border-b border-secondary-200/80 dark:border-secondary-800/60 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3" aria-label="RDC LAB - Accueil">
              <Image
                src="/image/logo lab.png"
                alt="RDC LAB - Laboratoire d'Analyse Minérale"
                width={56}
                height={56}
                priority
                className="h-14 w-auto rounded-md object-contain"
              />
              <span className="sr-only">RDC LAB</span>
              <span className="inline-flex items-baseline gap-1 font-extrabold tracking-tight text-base sm:text-lg">
                <span className="text-primary-700 dark:text-primary-400">RDC</span>
                <span className="text-orange-500">LAB</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              item.href.startsWith('/') ? (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-secondary-700 hover:text-primary-700 dark:text-secondary-200 dark:hover:text-primary-400 font-medium transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.key}
                  href={item.href}
                  className="text-secondary-700 hover:text-primary-700 dark:text-secondary-200 dark:hover:text-primary-400 font-medium transition-colors duration-200"
                >
                  {item.label}
                </a>
              )
            ))}
            {hasClientToken && (
              <Link href="/client" className="inline-flex items-center gap-2 font-semibold text-accent-700 hover:text-accent-800 dark:text-accent-400 dark:hover:text-accent-300 transition-colors">
                <span>Client</span>
                <span className="inline-block w-2 h-2 rounded-full bg-accent-500" />
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              icon={isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              title={isDark ? 'Mode clair' : 'Mode sombre'}
              className="hidden sm:flex"
            />
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLocale}
              icon={<Globe className="w-4 h-4" />}
              className="hidden sm:flex"
            >
              {locale.toUpperCase()}
            </Button>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-success-50 border border-success-200 rounded-lg">
                  <User className="w-4 h-4 text-success-600" />
                  <span className="text-sm font-medium text-success-800">{user?.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  icon={<LogOut className="w-4 h-4" />}
                  title="Se déconnecter"
                />
              </div>
            ) : (
              <Button
                variant="accent"
                size="sm"
                onClick={onLoginClick}
                icon={<LogIn className="w-4 h-4" />}
                className="hidden sm:flex"
              >
                {t.nav.login}
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              icon={mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              className="md:hidden"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-secondary-200 dark:border-secondary-800 py-4"
          >
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                item.href.startsWith('/') ? (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="text-secondary-700 hover:text-primary-700 dark:text-secondary-200 dark:hover:text-primary-400 font-medium py-2 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.key}
                    href={item.href}
                    className="text-secondary-700 hover:text-primary-700 dark:text-secondary-200 dark:hover:text-primary-400 font-medium py-2 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              ))}
              {hasClientToken && (
                <Link
                  href="/client"
                  className="inline-flex items-center gap-2 font-semibold text-accent-700 hover:text-accent-800 dark:text-accent-400 dark:hover:text-accent-300 py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Client</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-accent-500" />
                </Link>
              )}
              <div className="flex items-center gap-2 pt-2 border-t border-secondary-200 dark:border-secondary-800">
                {/* Theme toggle - mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  icon={isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                >
                  {isDark ? 'Clair' : 'Sombre'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLocale}
                  icon={<Globe className="w-4 h-4" />}
                >
                  {locale.toUpperCase()}
                </Button>
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-success-50 border border-success-200 rounded-lg">
                      <User className="w-4 h-4 text-success-600" />
                      <span className="text-sm font-medium text-success-800">{user?.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      icon={<LogOut className="w-4 h-4" />}
                    >
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onLoginClick}
                    icon={<LogIn className="w-4 h-4" />}
                  >
                    {t.nav.login}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
