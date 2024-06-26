package com.vertission.fivoto;

import android.os.Bundle; // react-native-bootsplash
import com.facebook.react.ReactActivity;
import com.zoontek.rnbootsplash.RNBootSplash; // react-native-bootsplash
public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */

  @Override // react-native-bootsplash
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    RNBootSplash.init(R.drawable.bootsplash, MainActivity.this); // <- display the generated bootsplash.xml drawable over our MainActivity
  } // react-native-bootsplash

  @Override
  protected String getMainComponentName() {
    return "fivoto";
  }
}
