package com.nabrothers.codechess.core.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.nabrothers.codechess.core.dao.BattleRecordDAO;
import com.nabrothers.codechess.core.data.BattleContext;
import com.nabrothers.codechess.core.dto.BattleContextDTO;
import com.nabrothers.codechess.core.dto.BattleProcessDTO;
import com.nabrothers.codechess.core.dto.BattleResultDTO;
import com.nabrothers.codechess.core.dto.BattleStartDTO;
import com.nabrothers.codechess.core.enums.BattleStatus;
import com.nabrothers.codechess.core.manager.BattleManager;
import com.nabrothers.codechess.core.po.BattleRecordPO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BattleContextService {
    @Autowired
    private BattleRecordDAO battleRecordDAO;

    @Autowired
    private BattleManager battleManager;

    public BattleStartDTO startBattle() {
        BattleStartDTO battleStartDTO = new BattleStartDTO();
        BattleRecordPO record = new BattleRecordPO();
        record.setStatus(BattleStatus.CREATE.getCode());
        battleRecordDAO.insert(record);
        battleStartDTO.setId(record.getId());
        boolean result = battleManager.addContext(record.getId());
        battleStartDTO.setSuccess(result);
        return battleStartDTO;
    }

    public BattleProcessDTO getProcess(Integer id) {
        BattleProcessDTO processDTO = new BattleProcessDTO();
        BattleContext battleContext = battleManager.getContext(id);
        if (battleContext == null) {
            return null;
        }
        if (battleContext.getStatus() == BattleStatus.FINISH.getCode()) {
            processDTO.setFinished(true);
        } else {
            processDTO.setFinished(false);
        }
        processDTO.setStep(battleContext.getCurrentStep());
        return processDTO;
    }

    public BattleResultDTO getBattleResult(Integer id) {
        BattleRecordPO record = battleRecordDAO.queryById(id);
        if (record == null || record.getStatus() != BattleStatus.FINISH.getCode()) {
            return null;
        }
        BattleResultDTO result = new BattleResultDTO();
        result.setStatus(record.getStatus());
        if (record.getResult() != null) {
            List<BattleContextDTO> history = JSON.parseArray(record.getResult(), BattleContextDTO.class);
            result.setSteps(history);
            result.setTotalSteps(history.size());
        }
        return result;
    }
}
