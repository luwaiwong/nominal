import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export function TestWidget() {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
      }}
    >
      <TextWidget
        text="Rockets are cool!"
        style={{
          fontSize: 32,
          color: '#000000',
        }}
      />
    </FlexWidget>
  );
}