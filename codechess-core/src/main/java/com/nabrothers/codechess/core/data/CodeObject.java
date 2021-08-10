package com.nabrothers.codechess.core.data;

import lombok.Data;

import java.util.concurrent.atomic.AtomicInteger;

@Data
public abstract class CodeObject {
    private static AtomicInteger currentSeq = new AtomicInteger();

    protected int id;
    protected int seq;
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
}
