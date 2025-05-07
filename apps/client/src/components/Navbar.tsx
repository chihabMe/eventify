import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IUserRole as UserRole } from "../interfaces"
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useLogoutMutation } from '@/services/auth/auth.queries';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser, isLoading } = useAuth()
  const { mutateAsync: logout } = useLogoutMutation()


  // Handle logout
  const handleLogout = async () => {
    await logout()
    toast({ title: "logged out" })
    window.location.replace("/")
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Get profile path based on user role
  const getProfilePath = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return '/dashboard';
      case 'ORGANIZER':
        return '/organizer/profile';
      case 'USER':
        return '/user/profile';
      default:
        return '/user/profile';
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
  ];

  // Define role-specific navigation items
  const roleNavItems = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return { name: 'Admin Dashboard', path: '/dashboard' };
      case 'ORGANIZER':
        return { name: 'My Events', path: '/organizer/profile' };
      case 'USER':
        return { name: 'My Bookings', path: '/user/profile' };
      default:
        return null;
    }
  };

  // Add role-specific nav item if user is logged in
  if (currentUser) {
    const roleItem = roleNavItems(currentUser.role);
    if (roleItem) {
      navLinks.push(roleItem);
    }
  }

  // Function to handle profile navigation
  const handleProfileClick = () => {
    if (currentUser) {
      navigate(getProfilePath(currentUser.role));
    }
    closeMenu();
  };

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-900">
      <div className="container mx-auto px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">SEBS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.path) ? 'text-primary' : 'text-gray-700 dark:text-gray-200'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {isLoading ? (
              // Show loading state while checking authentication
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : currentUser ? (
              // User is authenticated - show profile dropdown
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-2 h-8 hover:bg-purple-500 hover:text-white" >
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                          <img
                            src={currentUser.imageUrl || ""}
                            alt={currentUser.firstName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {currentUser.firstName}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 ">
                    <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer  py-2 px-2 hover:!text-white">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive py-2 px-2 hover:!bg-red-400 hover:!text-white"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              // User is not authenticated - show login/register buttons
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild>
                  <Link to="/login" className="flex items-center">
                    <LogIn className="mr-1 h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/register" className="flex items-center">
                    <UserPlus className="mr-1 h-4 w-4" />
                    Register
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-600 dark:text-gray-200 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 space-y-3 py-3 fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={closeMenu}
                className={`block py-2 px-3 rounded-md text-sm font-medium ${isActive(link.path)
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {isLoading ? (
              // Loading state in mobile menu
              <div className="h-10 mx-3 bg-gray-200 animate-pulse rounded"></div>
            ) : currentUser ? (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center px-3 py-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    <img
                      src={currentUser.imageUrl || "https://i.pravatar.cc/150"}
                      alt={currentUser.firstName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="ml-3 text-sm font-medium">
                    {currentUser.firstName}
                  </span>
                </div>
                <Link
                  to={getProfilePath(currentUser.role)}
                  onClick={closeMenu}
                  className="block py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    closeMenu();
                    handleLogout();
                  }}
                  className="mt-2 w-full text-left px-3 py-2 text-sm font-medium text-red-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="flex items-center px-3 py-2 bg-primary text-white rounded-md text-sm font-medium"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
