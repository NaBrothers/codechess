package com.nabrothers.codechess.core.context;

import com.nabrothers.codechess.core.enums.ContextStatus;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public abstract class Context {
    protected static final Logger logger = LogManager.getLogger(Context.class);

    protected int id;

    protected int currentStep;

    protected int status;

    private static final int MAX_STEPS = 500;

    public void start() {
        if (status != ContextStatus.CREATE.getCode()) {
            return;
        }
        status = ContextStatus.START.getCode();
        try {
            beforeStart();
        } catch (Exception e) {
            logger.error("["+id+"] beforeStart异常", e);
        }
        while (++currentStep < MAX_STEPS) {
            try {
                if (!doStep()) {
                    break;
                }
            } catch (Exception e) {
                logger.error("["+id+"] doStep异常", e);
            }
        }
        status = ContextStatus.FINISH.getCode();
        try {
            afterFinish();
        } catch (Exception e) {
            logger.error("["+id+"] afterFinish异常", e);
        }
    }

    abstract protected void beforeStart();

    abstract protected boolean doStep();

    abstract protected void afterFinish();

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getCurrentStep() {
        return currentStep;
    }

    public void setCurrentStep(int currentStep) {
        this.currentStep = currentStep;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
