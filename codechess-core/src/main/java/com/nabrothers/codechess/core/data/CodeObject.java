package com.nabrothers.codechess.core.data;

import lombok.Data;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@Data
public abstract class CodeObject {
    private static AtomicLong currentSeq = new AtomicLong();

    protected int id;
    protected long seq;
    protected int X;
    protected int Y;
    protected int type;

    protected CodeObject() {
        this.seq = currentSeq.getAndIncrement();
    }

    protected CodeObject(int id, int type) {
        this.id = id;
        this.type = type;
        this.seq = currentSeq.getAndIncrement();
    }

    public void addX(int d) {
        X += d;
    }

    public void addY(int d) {
        Y += d;
    }
}
