package com.codetrixstudio.capacitor.GoogleAuth;

import android.content.Intent;
import android.util.Log;

import com.codetrixstudio.capacitor.GoogleAuth.capacitorgoogleauth.R;
import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.Scope;
import com.google.android.gms.tasks.Task;

import org.json.JSONArray;
import org.json.JSONException;

import static android.content.ContentValues.TAG;

@NativePlugin(requestCodes = GoogleAuth.RC_SIGN_IN)
public class GoogleAuth extends Plugin {
  static final int RC_SIGN_IN = 1337;
  private GoogleSignInClient googleSignInClient;

  @Override
  public void load() {
    String clientId = this.getContext().getString(R.string.server_client_id);
    boolean forceCodeForRefreshToken = false;

    Boolean forceRefreshToken = (Boolean) getConfigValue("forceCodeForRefreshToken");
    if (forceRefreshToken != null) {
      forceCodeForRefreshToken = forceRefreshToken;
    }

    GoogleSignInOptions.Builder googleSignInBuilder = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(clientId)
            .requestEmail();

    if (forceCodeForRefreshToken) {
      googleSignInBuilder.requestServerAuthCode(clientId, true);
    }

//    try {
//      JSONArray scopeArray = (JSONArray) getConfigValue("scopes");
//      Log.d("Scopes", " Is nUll ?  : " + (scopeArray == null));
//      Scope[] scopes = new Scope[scopeArray.length() - 1];
//      Scope firstScope = new Scope(scopeArray.getString(0));
//      for (int i = 1; i < scopeArray.length(); i++) {
//        scopes[i - 1] = new Scope(scopeArray.getString(i));
//      }
//      googleSignInBuilder.requestScopes(firstScope, scopes);
//    } catch (JSONException e) {
//      e.printStackTrace();
//    }

    GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .build();
    GoogleSignInOptions googleSignInOptions = googleSignInBuilder.build();
    googleSignInClient = GoogleSignIn.getClient(this.getContext(), gso);
  }

  @PluginMethod()
  public void signIn(PluginCall call) {
    saveCall(call);
    Intent signInIntent = googleSignInClient.getSignInIntent();
    startActivityForResult(call, signInIntent, RC_SIGN_IN);
  }

  @Override
  protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
    super.handleOnActivityResult(requestCode, resultCode, data);

    if (requestCode == RC_SIGN_IN) {
      Log.d(TAG, "handleOnActivityResult: Works?");
      Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
      handleSignInResult(task);
    }
  }

  private void handleSignInResult(Task<GoogleSignInAccount> completedTask) {
    Log.d("TAG", "handleSignInResult: " + completedTask.toString());
    PluginCall signInCall = getSavedCall();

    if (signInCall == null) return;

    try {
      GoogleSignInAccount account = completedTask.getResult(ApiException.class);

      JSObject authentication = new JSObject();
      authentication.put("idToken", account.getIdToken());
      Log.d("API", "Response to be given : " + account);
      Log.d("API", "Response to be given : " + account.getEmail());

      JSObject user = new JSObject();
      user.put("serverAuthCode", account.getServerAuthCode());
      user.put("idToken", account.getIdToken());
      user.put("authentication", authentication);

      user.put("displayName", account.getDisplayName());
      user.put("email", account.getEmail());
      user.put("familyName", account.getFamilyName());
      user.put("givenName", account.getGivenName());
      user.put("id", account.getId());
      user.put("imageUrl", account.getPhotoUrl());
      Log.d("API", "Response to be given : " + user);
      signInCall.success(user);

    } catch (ApiException e) {
      signInCall.error("Something went wrong", e);
    }
  }

  @PluginMethod()
  public void refresh(final PluginCall call) {
    call.error("I don't know how to refresh token on Android");
  }

  @PluginMethod()
  public void signOut(final PluginCall call) {
    googleSignInClient.signOut();
    call.success();
  }
}
