
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockUsers } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { loginService } from "@/services/auth.services";
import { queryManager } from "@/services/query.manager";
import { authQueryKeys } from "@/services/auth/auth.queries";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Simple validation
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      // Mock authentication logic
      const response = await loginService({ email, password })
      if (!response) {

        throw new Error("Invalid email or password");
      }

      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.user.firstName}`,
      });
      await queryManager.invalidate(authQueryKeys.profile)

      // Redirect to appropriate dashboard based on user role
      switch (response.user.role) {
        case "USER":
          navigate("/user/profile");
          break;
        case "ORGANIZER":
          navigate("/organizer/profile");
          break
        default:
          navigate("/organizer/DASHBOARD");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Convenience login buttons for demo purposes
  const loginAsUserType = async (role: 'user' | 'organizer' | 'admin') => {
    setIsLoading(true);
    try {
      // Find user with matching role
      const user = mockUsers.find((user) => user.role === role);
      if (user) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        });

        navigate("/dashboard");
      }
    } catch (err) {
      setError("Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:text-primary/80"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label
                  htmlFor="remember_me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="#"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  "Signing in..."
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign in
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Demo Convenience Login Buttons */}
          <div className="mt-8 border-t pt-6">
            <p className="text-sm text-center mb-4 text-gray-500">
              Demo Quick Login
            </p>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loginAsUserType("user")}
                disabled={isLoading}
              >
                Login as User
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loginAsUserType("organizer")}
                disabled={isLoading}
              >
                Login as Organizer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loginAsUserType("admin")}
                disabled={isLoading}
              >
                Login as Admin
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
