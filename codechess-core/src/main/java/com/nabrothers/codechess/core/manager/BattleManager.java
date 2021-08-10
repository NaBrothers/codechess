package com.nabrothers.codechess.core.manager;

import com.nabrothers.codechess.core.data.BattleContext;
import com.nabrothers.codechess.core.enums.BattleStatus;
import com.nabrothers.codechess.core.po.BattleRecordPO;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class BattleManager {

    private Logger logger = LogManager.getLogger(BattleManager.class);

    private AtomicInteger threadNumber = new AtomicInteger(0);

    private ExecutorService battleExecutor = new ThreadPoolExecutor(32, 128, 30, TimeUnit.SECONDS,
            new ArrayBlockingQueue<>(512), r -> new Thread(r, "BattleContextThread-" + threadNumber.getAndIncrement()));

    private ConcurrentMap<Integer, BattleContext> contextMap = new ConcurrentHashMap();

    public BattleContext getContext(Integer id) {
        return contextMap.get(id);
    }

    public boolean addContext(Integer id) {
        if (contextMap.containsKey(id)) {
            logger.warn("["+ id +"] 已经在运行");
            return false;
        }
        try {
            BattleContext context = new BattleContext(id);
            contextMap.put(id, context);
            battleExecutor.submit(() -> {
                context.start();
            });
        } catch (Exception e) {
            logger.error(e.getMessage());
            return false;
        }
        return true;
    }
}
