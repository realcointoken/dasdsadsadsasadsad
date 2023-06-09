import { first, Observable, switchMap } from 'rxjs';

import { TxId } from '../../../common/types';
import { AddLiquidityFormModel } from '../../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { selectedNetwork$ } from '../../common/network';

export const deposit = (
  data: Required<AddLiquidityFormModel>,
): Observable<TxId> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.deposit(data)),
  );
