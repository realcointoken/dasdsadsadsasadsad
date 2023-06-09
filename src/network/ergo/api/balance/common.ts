import { ErgoBox } from '@ergolabs/ergo-sdk';
import {
  combineLatest,
  defaultIfEmpty,
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { AssetInfo } from '../../../../common/models/AssetInfo';
import {
  Asset,
  getListAvailableTokens,
} from '../../../../utils/getListAvailableTokens';
import { mapToAssetInfo } from '../common/assetInfoManager';
import { utxos$ } from '../utxos/utxos';

const toListAvailableTokens = (utxos: ErgoBox[]): Asset[] =>
  Object.values(getListAvailableTokens(utxos));

const isNotNFT = (assetInfo: AssetInfo | undefined): boolean =>
  !!assetInfo && assetInfo.emissionAmount !== 1n;

export const availableTokensDataWithNft$: Observable<[bigint, AssetInfo][]> =
  utxos$.pipe(
    map(toListAvailableTokens),
    switchMap((boxAssets) =>
      combineLatest<[bigint, AssetInfo][]>(
        boxAssets.map((ba) =>
          from(mapToAssetInfo(ba.tokenId)).pipe(
            map((assetInfo) => [ba.amount, assetInfo as AssetInfo]),
          ),
        ),
      ).pipe(defaultIfEmpty([])),
    ),
    publishReplay(1),
    refCount(),
  );

export const availableTokensData$: Observable<[bigint, AssetInfo][]> =
  availableTokensDataWithNft$.pipe(
    map((availableTokensData) =>
      availableTokensData.filter(([, assetInfo]) => isNotNFT(assetInfo)),
    ),
    publishReplay(1),
    refCount(),
  );
