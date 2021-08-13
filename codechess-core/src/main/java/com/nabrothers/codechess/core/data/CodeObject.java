package com.nabrothers.codechess.core.data;

import com.nabrothers.codechess.core.manager.BattleConfigManager;
import com.nabrothers.codechess.core.utils.BattleUtils;
import lombok.Data;

import java.util.concurrent.atomic.AtomicLong;

@Data
public abstract class CodeObject {
    private static AtomicLong currentSeq = new AtomicLong();

    protected int id;
    protected long seq;
    protected int x;
    protected int y;
    protected int type;

    protected CodeObject() {
        this.seq = currentSeq.getAndIncrement();
    }

    protected CodeObject(int id, int type) {
        this.id = id;
        this.type = type;
        this.seq = currentSeq.getAndIncrement();
    }

    public boolean isMovable() {
        return this instanceof Movable;
    }

    public boolean isVolume() {
        return this instanceof Volume;
    }
}
