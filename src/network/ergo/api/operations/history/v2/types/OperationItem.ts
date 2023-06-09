import { AddLiquidityItem, RawAddLiquidityItem } from './AddLiquidityOperation';
import { LmDepositItem, RawLmDepositItem } from './LmDepositOperation';
import { LmRedeemItem, RawLmRedeemItem } from './LmRedeemOperation';
import { LockItem, RawLockItem } from './LockOperation';
import {
  RawRemoveLiquidityItem,
  RemoveLiquidityItem,
} from './RemoveLiquidityOperation';
import { RawSwapItem, SwapItem } from './SwapOperation';

export type RawOperationItem =
  | RawSwapItem
  | RawAddLiquidityItem
  | RawRemoveLiquidityItem
  | RawLmDepositItem
  | RawLmRedeemItem
  | RawLockItem;

export type OperationItem =
  | SwapItem
  | AddLiquidityItem
  | RemoveLiquidityItem
  | LmDepositItem
  | LmRedeemItem
  | LockItem;
