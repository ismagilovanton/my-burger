import { describe, expect, it } from '@jest/globals';

import {
  addBurgerConstructorItem,
  burgerConstructorReducer,
  clearBurgerConstructor,
  moveBurgerConstructorItem,
  removeBurgerConstructorItem,
  setBurgerConstructorItems,
} from './burgerConstructorSlice';

describe('burgerConstructorReducer', () => {
  const mockBun = {
    _id: 'bun-1',
    name: 'Краторная булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://example.com/bun.png',
    image_mobile: 'https://example.com/bun-mobile.png',
    image_large: 'https://example.com/bun-large.png',
    __v: 0,
  };

  const mockMain = {
    _id: 'main-1',
    name: 'Говяжий метеорит',
    type: 'main',
    proteins: 800,
    fat: 800,
    carbohydrates: 300,
    calories: 2674,
    price: 3000,
    image: 'https://example.com/meat.png',
    image_mobile: 'https://example.com/meat-mobile.png',
    image_large: 'https://example.com/meat-large.png',
    __v: 0,
  };

  const mockSauce = {
    _id: 'sauce-1',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://example.com/sauce.png',
    image_mobile: 'https://example.com/sauce-mobile.png',
    image_large: 'https://example.com/sauce-large.png',
    __v: 0,
  };

  it('должен возвращать начальное состояние', () => {
    const state = burgerConstructorReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      items: [],
    });
  });

  describe('setBurgerConstructorItems', () => {
    it('должен устанавливать список элементов', () => {
      const items = [
        { ...mockBun, uniqueId: 'unique-1' },
        { ...mockMain, uniqueId: 'unique-2' },
      ];
      const action = setBurgerConstructorItems(items);
      const state = burgerConstructorReducer(undefined, action);
      expect(state.items).toEqual(items);
      expect(state.items).toHaveLength(2);
    });

    it('должен заменять существующие элементы', () => {
      const initialState = {
        items: [{ ...mockBun, uniqueId: 'unique-1' }],
      };
      const newItems = [{ ...mockMain, uniqueId: 'unique-2' }];
      const action = setBurgerConstructorItems(newItems);
      const state = burgerConstructorReducer(initialState, action);
      expect(state.items).toEqual(newItems);
      expect(state.items).toHaveLength(1);
    });
  });

  describe('addBurgerConstructorItem', () => {
    it('должен добавлять элемент типа main', () => {
      const action = addBurgerConstructorItem(mockMain);
      const state = burgerConstructorReducer(undefined, action);
      expect(state.items).toHaveLength(1);
      expect(state.items[0]._id).toBe(mockMain._id);
      expect(state.items[0].uniqueId).toBeDefined();
    });

    it('должен добавлять элемент типа sauce', () => {
      const action = addBurgerConstructorItem(mockSauce);
      const state = burgerConstructorReducer(undefined, action);
      expect(state.items).toHaveLength(1);
      expect(state.items[0]._id).toBe(mockSauce._id);
      expect(state.items[0].uniqueId).toBeDefined();
    });

    it('должен заменять существующую булку при добавлении новой', () => {
      const initialState = {
        items: [{ ...mockBun, uniqueId: 'unique-bun-1' }],
      };
      const newBun = {
        ...mockBun,
        _id: 'bun-2',
        name: 'Новая булка',
      };
      const action = addBurgerConstructorItem(newBun);
      const state = burgerConstructorReducer(initialState, action);
      expect(state.items).toHaveLength(1);
      expect(state.items[0]._id).toBe('bun-2');
      expect(state.items[0].name).toBe('Новая булка');
    });

    it('должен добавлять несколько элементов типа main', () => {
      const action1 = addBurgerConstructorItem(mockMain);
      const state1 = burgerConstructorReducer(undefined, action1);
      const action2 = addBurgerConstructorItem(mockMain);
      const state2 = burgerConstructorReducer(state1, action2);
      expect(state2.items).toHaveLength(2);
      expect(state2.items[0].uniqueId).not.toBe(state2.items[1].uniqueId);
    });
  });

  describe('removeBurgerConstructorItem', () => {
    it('должен удалять элемент по uniqueId', () => {
      const initialState = {
        items: [
          { ...mockMain, uniqueId: 'unique-1' },
          { ...mockSauce, uniqueId: 'unique-2' },
        ],
      };
      const action = removeBurgerConstructorItem('unique-1');
      const state = burgerConstructorReducer(initialState, action);
      expect(state.items).toHaveLength(1);
      expect(state.items[0].uniqueId).toBe('unique-2');
    });

    it('не должен изменять состояние при несуществующем uniqueId', () => {
      const initialState = {
        items: [{ ...mockMain, uniqueId: 'unique-1' }],
      };
      const action = removeBurgerConstructorItem('non-existent');
      const state = burgerConstructorReducer(initialState, action);
      expect(state.items).toEqual(initialState.items);
    });

    it('не должен изменять состояние при пустом массиве', () => {
      const initialState = { items: [] };
      const action = removeBurgerConstructorItem('unique-1');
      const state = burgerConstructorReducer(initialState, action);
      expect(state.items).toEqual([]);
    });
  });

  describe('moveBurgerConstructorItem', () => {
    it('должен перемещать элемент с одного индекса на другой', () => {
      const initialState = {
        items: [
          { ...mockMain, uniqueId: 'unique-1' },
          { ...mockSauce, uniqueId: 'unique-2' },
          { ...mockMain, uniqueId: 'unique-3' },
        ],
      };
      const action = moveBurgerConstructorItem({ fromIndex: 0, toIndex: 2 });
      const state = burgerConstructorReducer(initialState, action);
      expect(state.items[0].uniqueId).toBe('unique-2');
      expect(state.items[2].uniqueId).toBe('unique-1');
    });

    it('не должен изменять состояние при одинаковых индексах', () => {
      const initialState = {
        items: [
          { ...mockMain, uniqueId: 'unique-1' },
          { ...mockSauce, uniqueId: 'unique-2' },
        ],
      };
      const action = moveBurgerConstructorItem({ fromIndex: 0, toIndex: 0 });
      const state = burgerConstructorReducer(initialState, action);
      expect(state.items).toEqual(initialState.items);
    });

    it('не должен изменять состояние при отрицательных индексах', () => {
      const initialState = {
        items: [{ ...mockMain, uniqueId: 'unique-1' }],
      };
      const action = moveBurgerConstructorItem({ fromIndex: -1, toIndex: 0 });
      const state = burgerConstructorReducer(initialState, action);
      expect(state.items).toEqual(initialState.items);
    });

    it('не должен изменять состояние при индексах за пределами массива', () => {
      const initialState = {
        items: [{ ...mockMain, uniqueId: 'unique-1' }],
      };
      const action = moveBurgerConstructorItem({ fromIndex: 0, toIndex: 10 });
      const state = burgerConstructorReducer(initialState, action);
      expect(state.items).toEqual(initialState.items);
    });
  });

  describe('clearBurgerConstructor', () => {
    it('должен очищать все элементы', () => {
      const initialState = {
        items: [
          { ...mockBun, uniqueId: 'unique-1' },
          { ...mockMain, uniqueId: 'unique-2' },
          { ...mockSauce, uniqueId: 'unique-3' },
        ],
      };
      const action = clearBurgerConstructor();
      const state = burgerConstructorReducer(initialState, action);
      expect(state.items).toEqual([]);
    });

    it('должен работать с пустым массивом', () => {
      const initialState = { items: [] };
      const action = clearBurgerConstructor();
      const state = burgerConstructorReducer(initialState, action);
      expect(state.items).toEqual([]);
    });
  });
});

