import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique_entity_id';

export interface PlayerProps {
  name: string;
  email: string;
  password: string;
  status?: 'active' | 'inactive';
  accessType?: 'player' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export class Player extends Entity<PlayerProps> {
  get name() {
    return this.props.name;
  }
  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get status() {
    return this.props.status;
  }

  get accessType() {
    return this.props.accessType;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: PlayerProps, id?: UniqueEntityID) {
    if (!props.accessType) {
      props.accessType = 'player';
    }

    if (!props.status) {
      props.status = 'active';
    }
    const player = new Player(props, id);

    return player;
  }
}
