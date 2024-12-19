import { Mock } from 'vitest'
import { UnwrapRef } from 'vue'
import { Store, StoreDefinition } from 'pinia'

function mockedStore<TStoreDef extends () => unknown>(
  useStore: TStoreDef
): TStoreDef extends StoreDefinition<
  infer Id,
  infer State,
  infer Getters,
  infer Actions
>
  ? Store<
      Id,
      State,
      Record<string, never>,
      {
        [K in keyof Actions]: Actions[K] extends (...args: any[]) => any
          ? // 👇 depends on your testing framework
            Mock<Actions[K]>
          : Actions[K]
      }
    > & {
      [K in keyof Getters]: UnwrapRef<Getters[K]>
    }
  : ReturnType<TStoreDef> {
  return useStore() as any
}