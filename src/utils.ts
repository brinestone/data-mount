import { ActionContext, ActionStatus, ActionType, ofActionCompleted, ofActionDispatched, ofActionSuccessful } from "@ngxs/store";
import { map, merge, mergeMap, OperatorFunction } from "rxjs";

type TupleKeys<T extends any[]> = Exclude<keyof T, keyof []>;
type Constructed<T> = T extends new (...args: any[]) => infer U ? U : T;

export function ofActionInProgress<T extends ActionType[]>(...types: T): OperatorFunction<ActionContext<Constructed<T[TupleKeys<T>]>>, boolean> {
	return v => {
		return merge(
			v.pipe(
				ofActionDispatched(...types),
				map(() => true)
			),
			v.pipe(
				ofActionCompleted(...types),
				map(() => false)
			)
		)
	}
}
