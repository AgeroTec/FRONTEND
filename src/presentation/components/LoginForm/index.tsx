import { useEffect, useRef, useState, FormEvent } from "react";

interface LoginFormProps {
  onSubmit: (login: string, senha: string, rememberMe: boolean) => Promise<void>;
  loading: boolean;
  error?: string;
}

export function LoginForm({ onSubmit, loading, error }: LoginFormProps) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(true);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const usuarioRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(usuario, senha, lembrar);
  };

  useEffect(() => {
    if (!error) return;
    if (!usuario.trim()) {
      usuarioRef.current?.focus();
      return;
    }
    senhaRef.current?.focus();
  }, [error, usuario, senha]);

  const handleCapsLockState = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(event.getModifierState("CapsLock"));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Usuário
        </label>
        <input
          ref={usuarioRef}
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-blue-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Digite seu usuário"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Senha
        </label>
        <input
          ref={senhaRef}
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyUp={handleCapsLockState}
          onKeyDown={handleCapsLockState}
          onBlur={() => setCapsLockOn(false)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-blue-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Digite sua senha"
          required
          disabled={loading}
        />
        {capsLockOn && (
          <p className="mt-2 text-sm text-amber-700">Caps Lock ativado.</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="lembrar"
            checked={lembrar}
            onChange={(e) => setLembrar(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={loading}
          />
          <label htmlFor="lembrar" className="ml-2 block text-sm text-gray-700">
            Lembrar de mim
          </label>
        </div>
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          disabled={loading}
        >
          Esqueceu sua senha?
        </button>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
