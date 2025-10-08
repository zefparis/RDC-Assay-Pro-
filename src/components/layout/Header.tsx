import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogIn, LogOut, Menu, X, Globe, User } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface HeaderProps {
  onLoginClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { t, locale, changeLocale } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-secondary-200 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white grid place-items-center font-bold text-lg shadow-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              G
            </motion.div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-secondary-900">GeoCert Africa</span>
              <Badge variant="info" size="sm">Filiale de SGS</Badge>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              item.href.startsWith('/') ? (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-secondary-600 hover:text-primary-600 font-medium transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.key}
                  href={item.href}
                  className="text-secondary-600 hover:text-primary-600 font-medium transition-colors duration-200"
                >
                  {item.label}
                </a>
              )
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
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
                variant="outline"
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
            className="md:hidden border-t border-secondary-200 py-4"
          >
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                item.href.startsWith('/') ? (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="text-secondary-600 hover:text-primary-600 font-medium py-2 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.key}
                    href={item.href}
                    className="text-secondary-600 hover:text-primary-600 font-medium py-2 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              ))}
              <div className="flex items-center gap-2 pt-2 border-t border-secondary-200">
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
