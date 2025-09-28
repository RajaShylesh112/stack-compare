// src/repositories/base.repository.ts

export interface IBaseRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: number, data: Partial<Omit<T, 'id'>>): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}
