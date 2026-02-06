import { describe, expect, it } from '@jest/globals';

import { MOCK_BUN, MOCK_MAIN, MOCK_SAUCE } from '../../test-fixtures/mock-data';
import {
  addBurgerConstructorItem,
  burgerConstructorReducer,
  clearBurgerConstructor,
  initialState,
  moveBurgerConstructorItem,
  removeBurgerConstructorItem,
  setBurgerConstructorItems,
} from './burgerConstructorSlice';

describe('burgerConstructorReducer', () => {
  it('должен возвращать начальное состояние', () => {
    const state = burgerConstructorReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('setBurgerConstructorItems', () => {
    it('должен устанавливать список элементов', () => {
      const items = [
        { ...MOCK_BUN, uniqueId: 'unique-1' },
        { ...MOCK_MAIN, uniqueId: 'unique-2' },
      ];
      const action = setBurgerConstructorItems(items);
      const state = burgerConstructorReducer(undefined, action);
      expect(state.items).toEqual(items);
      expect(state.items).toHaveLength(2);
    });

    it('должен заменять существующие элементы', () => {
      const stateWithItems = {
        ...initialState,
        items: [{ ...MOCK_BUN, uniqueId: 'unique-1' }],
      };
      const newItems = [{ ...MOCK_MAIN, uniqueId: 'unique-2' }];
      const action = setBurgerConstructorItems(newItems);
      const state = burgerConstructorReducer(stateWithItems, action);
      expect(state.items).toEqual(newItems);
      expect(state.items).toHaveLength(1);
    });
  });

  describe('addBurgerConstructorItem', () => {
    it('должен добавлять элемент типа main', () => {
      const action = addBurgerConstructorItem(MOCK_MAIN);
      const state = burgerConstructorReducer(undefined, action);
      expect(state.items).toHaveLength(1);
      expect(state.items[0]._id).toBe(MOCK_MAIN._id);
      expect(state.items[0].uniqueId).toBeDefined();
    });

    it('должен добавлять элемент типа sauce', () => {
      const action = addBurgerConstructorItem(MOCK_SAUCE);
      const state = burgerConstructorReducer(undefined, action);
      expect(state.items).toHaveLength(1);
      expect(state.items[0]._id).toBe(MOCK_SAUCE._id);
      expect(state.items[0].uniqueId).toBeDefined();
    });

    it('должен заменять существующую булку при добавлении новой', () => {
      const stateWithBun = {
        ...initialState,
        items: [{ ...MOCK_BUN, uniqueId: 'unique-bun-1' }],
      };
      const newBun = {
        ...MOCK_BUN,
        _id: 'bun-2',
        name: 'Новая булка',
      };
      const action = addBurgerConstructorItem(newBun);
      const state = burgerConstructorReducer(stateWithBun, action);
      expect(state.items).toHaveLength(1);
      expect(state.items[0]._id).toBe('bun-2');
      expect(state.items[0].name).toBe('Новая булка');
    });

    it('должен добавлять несколько элементов типа main', () => {
      const action1 = addBurgerConstructorItem(MOCK_MAIN);
      const state1 = burgerConstructorReducer(undefined, action1);
      const action2 = addBurgerConstructorItem(MOCK_MAIN);
      const state2 = burgerConstructorReducer(state1, action2);
      expect(state2.items).toHaveLength(2);
      expect(state2.items[0].uniqueId).not.toBe(state2.items[1].uniqueId);
    });
  });

  describe('removeBurgerConstructorItem', () => {
    it('должен удалять элемент по uniqueId', () => {
      const stateWithItems = {
        ...initialState,
        items: [
          { ...MOCK_MAIN, uniqueId: 'unique-1' },
          { ...MOCK_SAUCE, uniqueId: 'unique-2' },
        ],
      };
      const action = removeBurgerConstructorItem('unique-1');
      const state = burgerConstructorReducer(stateWithItems, action);
      expect(state.items).toHaveLength(1);
      expect(state.items[0].uniqueId).toBe('unique-2');
    });

    it('не должен изменять состояние при несуществующем uniqueId', () => {
      const stateWithItem = {
        ...initialState,
        items: [{ ...MOCK_MAIN, uniqueId: 'unique-1' }],
      };
      const action = removeBurgerConstructorItem('non-existent');
      const state = burgerConstructorReducer(stateWithItem, action);
      expect(state.items).toEqual(stateWithItem.items);
    });

    it('не должен изменять состояние при пустом массиве', () => {
      const action = removeBurgerConstructorItem('unique-1');
      const state = burgerConstructorReducer(initialState, action);
      expect(state.items).toEqual([]);
    });
  });

  describe('moveBurgerConstructorItem', () => {
    it('должен перемещать элемент с одного индекса на другой', () => {
      const stateWithItems = {
        ...initialState,
        items: [
          { ...MOCK_MAIN, uniqueId: 'unique-1' },
          { ...MOCK_SAUCE, uniqueId: 'unique-2' },
          { ...MOCK_MAIN, uniqueId: 'unique-3' },
        ],
      };
      const action = moveBurgerConstructorItem({ fromIndex: 0, toIndex: 2 });
      const state = burgerConstructorReducer(stateWithItems, action);
      expect(state.items[0].uniqueId).toBe('unique-2');
      expect(state.items[2].uniqueId).toBe('unique-1');
    });

    it('не должен изменять состояние при одинаковых индексах', () => {
      const stateWithItems = {
        ...initialState,
        items: [
          { ...MOCK_MAIN, uniqueId: 'unique-1' },
          { ...MOCK_SAUCE, uniqueId: 'unique-2' },
        ],
      };
      const action = moveBurgerConstructorItem({ fromIndex: 0, toIndex: 0 });
      const state = burgerConstructorReducer(stateWithItems, action);
      expect(state.items).toEqual(stateWithItems.items);
    });

    it('не должен изменять состояние при отрицательных индексах', () => {
      const stateWithItem = {
        ...initialState,
        items: [{ ...MOCK_MAIN, uniqueId: 'unique-1' }],
      };
      const action = moveBurgerConstructorItem({ fromIndex: -1, toIndex: 0 });
      const state = burgerConstructorReducer(stateWithItem, action);
      expect(state.items).toEqual(stateWithItem.items);
    });

    it('не должен изменять состояние при индексах за пределами массива', () => {
      const stateWithItem = {
        ...initialState,
        items: [{ ...MOCK_MAIN, uniqueId: 'unique-1' }],
      };
      const action = moveBurgerConstructorItem({ fromIndex: 0, toIndex: 10 });
      const state = burgerConstructorReducer(stateWithItem, action);
      expect(state.items).toEqual(stateWithItem.items);
    });
  });

  describe('clearBurgerConstructor', () => {
    it('должен очищать все элементы', () => {
      const stateWithItems = {
        ...initialState,
        items: [
          { ...MOCK_BUN, uniqueId: 'unique-1' },
          { ...MOCK_MAIN, uniqueId: 'unique-2' },
          { ...MOCK_SAUCE, uniqueId: 'unique-3' },
        ],
      };
      const action = clearBurgerConstructor();
      const state = burgerConstructorReducer(stateWithItems, action);
      expect(state.items).toEqual([]);
    });

    it('должен работать с пустым массивом', () => {
      const action = clearBurgerConstructor();
      const state = burgerConstructorReducer(initialState, action);
      expect(state.items).toEqual([]);
    });
  });
});
