package com.nabrothers.codechess.core.manager;

import com.nabrothers.codechess.core.context.BattleContext;
import com.nabrothers.codechess.core.context.Context;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class BattleManager {

    private Logger logger = LogManager.getLogger(BattleManager.class);

    private AtomicInteger threadNumber = new AtomicInteger(0);

    private ExecutorService battleExecutor = new ThreadPoolExecutor(0, 128, 60, TimeUnit.SECONDS,
            new SynchronousQueue<>(), r -> new Thread(r, "BattleContextThread-" + threadNumber.getAndIncrement()));

    private ConcurrentMap<Integer, Context> contextMap = new ConcurrentHashMap();

    public Context getContext(Integer id) {
        return contextMap.get(id);
    }

    public boolean addContext(Integer id) {
        if (contextMap.containsKey(id)) {
            logger.warn("["+ id +"] 已经在运行");
            return false;
        }
        try {
            Context context = new BattleContext(id);
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
