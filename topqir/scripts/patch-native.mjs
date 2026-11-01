// `npx cap add android|ios` дан кейин ишга туширилади:
// илова номи, экран ўчмаслиги, версия рақами.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const platform = process.argv[2];
const DISPLAY = "Топқир";
const build = process.env.VERSION_CODE || "1";
const version = process.env.VERSION_NAME || "1.0." + build;

function edit(file, fn) {
  const p = path.join(root, file);
  const before = fs.readFileSync(p, "utf8");
  const after = fn(before);
  if (after === before) console.warn("! ўзгармади:", file);
  fs.writeFileSync(p, after);
  console.log("✓", file);
}

if (platform === "android") {
  edit("android/app/src/main/res/values/strings.xml", s =>
    s.replace(/(<string name="app_name">)[^<]*/, `$1${DISPLAY}`)
     .replace(/(<string name="title_activity_main">)[^<]*/, `$1${DISPLAY}`));

  edit("android/app/src/main/java/uz/topqir/app/MainActivity.java", () => `package uz.topqir.app;

import android.os.Bundle;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // ўйин пайтида экран ўчиб қолмасин
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }
}
`);

  edit("android/app/build.gradle", s =>
    s.replace(/versionCode\s+\d+/, `versionCode ${parseInt(build, 10)}`)
     .replace(/versionName\s+"[^"]*"/, `versionName "${version}"`));
}

if (platform === "ios") {
  edit("ios/App/App/AppDelegate.swift", s =>
    s.includes("isIdleTimerDisabled") ? s :
    s.replace(/(didFinishLaunchingWithOptions[^{]*\{)/, `$1\n        UIApplication.shared.isIdleTimerDisabled = true`));

  edit("ios/App/App/Info.plist", s => {
    s = s.replace(/(<key>CFBundleDisplayName<\/key>\s*<string>)[^<]*/, `$1${DISPLAY}`);
    if (!s.includes("ITSAppUsesNonExemptEncryption"))
      s = s.replace(/<dict>/, `<dict>\n\t<key>ITSAppUsesNonExemptEncryption</key>\n\t<false/>`);
    if (!s.includes("NSMotionUsageDescription"))
      s = s.replace(/<dict>/, `<dict>\n\t<key>NSMotionUsageDescription</key>\n\t<string>Телефонни эгиб жавоб бериш учун ҳаракат датчиги керак.</string>`);
    return s;
  });

  edit("ios/App/App.xcodeproj/project.pbxproj", s =>
    s.replace(/CURRENT_PROJECT_VERSION = [^;]+;/g, `CURRENT_PROJECT_VERSION = ${build};`)
     .replace(/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${version};`));
}
