import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/compras/entities/compra.entity';
import { Repository } from 'typeorm';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { Compra } from './entities/compra.entity';

@Injectable()
export class ComprasService {
  constructor(
    @InjectRepository(Compra)
    private compraRepository: Repository<Compra>,
  ) {}

  async create(createCompraDto: CreateCompraDto): Promise<Compra> {
    return this.compraRepository.save({
      totalCompra: createCompraDto.totalCompra,
      usuarios: { id: createCompraDto.IdUsuario },
    });
  }

  async findAll(): Promise<Compra[]> {
    return this.compraRepository.find({ relations: ['usuarios'] });
  }

  async findOne(id: number): Promise<Compra> {
    const compra = await this.compraRepository.findOne({
      where: { id },
      relations: ['usuarios'],
    });
    if (!compra) {
      throw new NotFoundException(`No existe la compra ${id}`);
    }
    return compra;
  }

  async update(id: number, updateCompraDto: UpdateCompraDto): Promise<Compra> {
    const compra = await this.compraRepository.findOneBy({ id });
    if (!compra) {
      throw new NotFoundException(`No existe la compra ${id}`);
    }
    const compraUpdate = Object.assign(compra, updateCompraDto);
    compraUpdate.usuarios = { id: updateCompraDto.IdUsuario } as Usuario;
    return this.compraRepository.save(compraUpdate);
  }

  async remove(id: number) {
    const compra = await this.compraRepository.findOneBy({ id });
    if (!compra) {
      throw new NotFoundException(`No existe la compra ${id}`);
    }
    return this.compraRepository.delete(id);
  }
}
