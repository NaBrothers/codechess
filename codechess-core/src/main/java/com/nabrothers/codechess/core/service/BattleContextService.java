package com.nabrothers.codechess.core.service;

import com.nabrothers.codechess.core.data.BattleContext;
import com.nabrothers.codechess.core.dto.BattleContextDTO;
import com.nabrothers.codechess.core.dto.BattleProcessDTO;
import com.nabrothers.codechess.core.dto.BattleResultDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BattleContextService {
    @Autowired
    private BattleContext battleContext;

    public BattleProcessDTO getProcess() {
        BattleProcessDTO processDTO = new BattleProcessDTO();
        if (battleContext.getStatus() == 2) {
            processDTO.setFinished(true);
        } else {
            processDTO.setFinished(false);
        }
        processDTO.setStep(battleContext.getCurrentStep());
        return processDTO;
    }

    public BattleResultDTO getBattleResult() {
        BattleResultDTO result = new BattleResultDTO();
        List<BattleContextDTO> history = battleContext.getHistory();
        result.setSteps(history);
        return result;
    }
}
