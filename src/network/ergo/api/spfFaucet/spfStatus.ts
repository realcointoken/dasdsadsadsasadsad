import axios from 'axios';
import { DateTime } from 'luxon';
import {
  filter,
  from,
  map,
  merge,
  Observable,
  of,
  publishReplay,
  refCount,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { uint } from '../../../../common/types';
import { getAddresses } from '../addresses/addresses';
import { pollingInterval$, stopPolling } from './common';

export const updateStatus = new Subject<void>();

export enum SpfStatus {
  Init = 'Init',
  Pending = 'Pending',
  WaitingConfirmation = 'WaitingConfirmation',
  Claimed = 'Claimed',
  NothingToClaim = 'NothingToClaim',
  NoAddresses = 'NoAddresses',
}

export interface RawClaimSpfStatusResponse {
  readonly status: SpfStatus;
  readonly timestamp: number;
  readonly nextStageTs: number;
  readonly stage: uint;
  readonly startDate: number;
}

export interface ClaimSpfStatusResponse {
  readonly status: SpfStatus;
  readonly dateTime: DateTime;
  readonly nextStageDateTime: DateTime;
  readonly startDate: DateTime;
  readonly stage: uint;
}

export const LAST_STAGE = 7;

export const spfStatus$: Observable<ClaimSpfStatusResponse> = merge(
  pollingInterval$,
  updateStatus,
).pipe(
  switchMap(() => getAddresses()),
  filter((addresses) => !!addresses?.length),
  switchMap((addresses) =>
    !!addresses?.length
      ? from(
          axios.post<RawClaimSpfStatusResponse>(
            `${applicationConfig.networksSettings.ergo.spfFaucet}status`,
            { addresses },
          ),
        )
      : of({
          data: {
            status: SpfStatus.NoAddresses,
            timestamp: 0,
            stage: 0,
            nextStageTs: 0,
            startDate: 0,
          },
        }),
  ),
  map((res) => ({
    status: res.data.status,
    dateTime: DateTime.fromMillis(res.data.timestamp || 0),
    stage: res.data.stage,
    nextStageDateTime: DateTime.fromMillis(res.data.nextStageTs || 0),
    startDate: DateTime.fromMillis(res.data.startDate || 0),
  })),
  tap((status) => {
    if (status.stage === LAST_STAGE && status.status === SpfStatus.Claimed) {
      stopPolling();
    }
  }),
  publishReplay(1),
  refCount(),
);
