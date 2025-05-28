import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../entity/user.entity';

export default class InitialSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    console.log('🔥 Seeding Users...');
    const users = [
      {
        username: '관리자',
        email: 'admin@example.com',
        password: 'qwe123!@#',
      },
      {
        username: '유저01',
        email: 'user01@example.com',
        password: 'user01!@#',
      },
    ];

    for (const user of users) {
      await userRepository.save(userRepository.create(user));
    }
  }
}
