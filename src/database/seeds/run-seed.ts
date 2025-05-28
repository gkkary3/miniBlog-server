import { config } from 'dotenv';
import { runSeeders } from 'typeorm-extension';
import dataSource from '../data-source';

// 환경변수 로드
config({ path: '.env.local' });

const runSeeder = async () => {
  try {
    // 데이터베이스 연결 초기화
    await dataSource.initialize();

    // 시더 실행
    await runSeeders(dataSource, {
      seeds: ['src/database/seeds/*.seed.ts'],
    });
  } catch (error) {
    process.exit(1);
  } finally {
    // 연결 종료
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
};

runSeeder();
