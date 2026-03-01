"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function TwoFASetupPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/2fa/setup");
      const data = await res.json();
      if (res.ok) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
      } else {
        setError("Failed to load 2FA setup. Please try again.");
      }
      setFetching(false);
    })();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/2fa/enable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Invalid code. Please check your authenticator.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 2000);
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="text-6xl">✅</div>
          <h2 className="text-2xl font-bold text-foreground">{t("setup_success_title")}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t("setup_success_subtitle")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🛡️</div>
          <h1 className="text-2xl font-bold text-foreground">{t("setup_title")}</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">{t("setup_subtitle")}</p>
        </div>

        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-xl shadow-black/5 dark:shadow-black/20 space-y-6">
          {/* Step 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t("setup_step1")}</span>
            </div>
            <p className="text-xs text-gray-500 ml-8">{t("setup_step1_hint")}</p>
            {qrCode && (
              <div className="flex justify-center">
                <div className="bg-white p-3 rounded-xl border border-gray-100 dark:border-transparent shadow-sm">
                  <Image src={qrCode} alt="2FA QR Code" width={180} height={180} />
                </div>
              </div>
            )}
          </div>

          {secret && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">{t("setup_manual")}</p>
              <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2">
                <code className="text-blue-600 dark:text-blue-300 text-xs font-mono tracking-wider break-all">{secret}</code>
              </div>
            </div>
          )}

          {/* Step 2 */}
          <div className="space-y-3 border-t border-gray-100 dark:border-white/10 pt-5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t("setup_step2")}</span>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full px-4 py-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-foreground placeholder-gray-400 dark:placeholder-gray-600 text-2xl text-center tracking-[0.5em] font-mono focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? t("twofa_verifying") : t("setup_enable")}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-600">
            {t("setup_footer")}
          </p>
        </div>
      </div>
    </div>
  );
}
