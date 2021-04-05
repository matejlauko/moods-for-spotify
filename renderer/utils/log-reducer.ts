import log from '@/utils/logger';
import * as React from 'react';

export function logReducer<
  S,
  A extends { type: string; payload?: Record<string, any> }
>(reducer: (state: S, action: A) => S) {
  return React.useCallback(
    (state: S, action: A) => {
      const result = reducer(state, action);

      log.debug(action.type, {
        payload: action.payload,
        before: state,
        after: result,
      });

      return result;
    },
    [reducer]
  );
}
