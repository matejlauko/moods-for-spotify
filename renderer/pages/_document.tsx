import { getCssString, theme } from '@/styles';
import { Loading } from '@/ui';
import NextDocument, { Head, Html, Main, NextScript } from 'next/document';
import * as React from 'react';

class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          {/* <meta
            name="viewport"
            content={
              'user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height'
            }
          /> */}
          {/* <meta
            httpEquiv="Content-Security-Policy"
            content="default-src 'self' data: 'unsafe-inline' 'unsafe-eval'"
          /> */}

          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssString() }}
          />
        </Head>

        <body style={{ backgroundColor: theme.colors?.bg_home as string }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: -1,
            }}
          >
            <Loading />
          </div>

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
