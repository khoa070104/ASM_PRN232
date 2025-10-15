using System;
using System.IO;

namespace Api.Common
{
    public static class ConfigConstants
    {
        private static bool _loaded = false;

        static ConfigConstants()
        {
            TryLoadDotEnv();
        }

        private static void TryLoadDotEnv()
        {
            if (_loaded) return;
            try
            {
                // Load .env from Api directory if present
                var baseDir = AppContext.BaseDirectory;
                // ascend until finding Api folder containing appsettings.json
                var dir = new DirectoryInfo(baseDir);
                while (dir != null && !File.Exists(Path.Combine(dir.FullName, "appsettings.json")))
                {
                    dir = dir.Parent;
                }
                if (dir != null)
                {
                    var envPath = Path.Combine(dir.FullName, ".env");
                    if (File.Exists(envPath))
                    {
                        foreach (var line in File.ReadAllLines(envPath))
                        {
                            var trimmed = line.Trim();
                            if (string.IsNullOrWhiteSpace(trimmed) || trimmed.StartsWith("#")) continue;
                            var idx = trimmed.IndexOf('=');
                            if (idx <= 0) continue;
                            var key = trimmed.Substring(0, idx).Trim();
                            var value = trimmed.Substring(idx + 1).Trim();
                            Environment.SetEnvironmentVariable(key, value);
                        }
                    }
                }
            }
            catch
            {
                // ignore
            }
            _loaded = true;
        }

        // Stripe
        public static string StripeSecretKey =>
            Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY") ?? string.Empty;

        public static string StripePublishableKey =>
            Environment.GetEnvironmentVariable("STRIPE_PUBLISHABLE_KEY") ?? string.Empty;
    }
}


