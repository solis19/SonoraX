import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

type AuthError = { code?: string };

function getErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "El email no es válido.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Correo o contraseña incorrectos.";
    case "auth/email-already-in-use":
      return "Este email ya está registrado.";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Intenta más tarde.";
    default:
      return "Ocurrió un error. Intenta de nuevo.";
  }
}

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [loading, setLoading]   = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) { setError("Completa todos los campos."); return; }
    setError(""); setSuccess(""); setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(getErrorMessage((err as AuthError).code ?? ""));
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!email || !password) { setError("Completa todos los campos."); return; }
    setError(""); setSuccess(""); setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(getErrorMessage((err as AuthError).code ?? ""));
    } finally { setLoading(false); }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Escribe tu email arriba para recuperar la contraseña.");
      return;
    }
    setError(""); setSuccess(""); setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("✅ Te enviamos un correo para restablecer tu contraseña.");
    } catch (err: unknown) {
      setError(getErrorMessage((err as AuthError).code ?? ""));
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="logo-box">🎵</div>
        <h1>SonoraX</h1>
        <p>Smart music for your business</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          autoComplete="current-password"
        />

        <button
          className="forgot-btn"
          onClick={handleForgotPassword}
          disabled={loading}
        >
          ¿Olvidaste tu contraseña?
        </button>

        {error   && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <button className="sign-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Cargando..." : "Sign In"}
        </button>

        <button className="create-btn" onClick={handleRegister} disabled={loading}>
          Create Account
        </button>

      </div>
    </div>
  );
}

export default Login;