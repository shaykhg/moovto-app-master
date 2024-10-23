package io.ionic.starter;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // printHashKey(this);
    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
    }});
  }

//  public static void printHashKey(Context pContext) {
//    try {
//      PackageInfo info = pContext.getPackageManager().getPackageInfo(pContext.getPackageName(), PackageManager.GET_SIGNATURES);
//      for (Signature signature : info.signatures) {
//        MessageDigest md = MessageDigest.getInstance("SHA");
//        md.update(signature.toByteArray());
//        String hashKey = new String(Base64.encode(md.digest(), 0));
//        Log.i(TAG, "printHashKey() Hash Key: " + hashKey);
//      }
//    } catch (NoSuchAlgorithmException e) {
//      Log.e(TAG, "printHashKey()", e);
//    } catch (Exception e) {
//      Log.e(TAG, "printHashKey()", e);
//    }
//  }
}
