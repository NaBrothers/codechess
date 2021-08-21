package com.nabrothers.codechess.core.context;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.nabrothers.codechess.core.dao.BattleRecordDAO;
import com.nabrothers.codechess.core.data.Effect;
import com.nabrothers.codechess.core.data.Flyer;
import com.nabrothers.codechess.core.data.Player;
import com.nabrothers.codechess.core.dto.BattleContextDTO;
import com.nabrothers.codechess.core.enums.EffectStatus;
import com.nabrothers.codechess.core.enums.ObjectType;
import com.nabrothers.codechess.core.enums.PlayerStatus;
import com.nabrothers.codechess.core.manager.BattleConfigManager;
import com.nabrothers.codechess.core.po.BattleRecordPO;
import com.nabrothers.codechess.core.utils.ApplicationContextProvider;
import com.nabrothers.codechess.core.utils.BattleUtils;
import com.nabrothers.codechess.core.utils.CopyUtils;

import java.util.*;
import java.util.stream.Collectors;

public class BattleContext extends Context{

    private List<BattleContextDTO> history = new ArrayList<>();

    private static final BattleRecordDAO battleRecordDAO = ApplicationContextProvider.getBean(BattleRecordDAO.class);

    public BattleContext(int id) {
        this.id = id;
    }

    private Map<Long, Player> playerMap = new HashMap();

    private Map<Long, Flyer> flyerMap = new HashMap();

    // Mock
    {
        Player a1 = new Player(101);
        a1.setX(3);
        a1.setY(18);
        a1.setHp(20);
        a1.setUserId(111);
        playerMap.put(a1.getSeq(), a1);
        Player a2 = new Player(102);
        a2.setX(5);
        a2.setY(20);
        a2.setHp(20);
        a2.setUserId(111);
        playerMap.put(a2.getSeq(), a2);
        Player b1 = new Player(201);
        b1.setX(3);
        b1.setY(5);
        b1.setHp(20);
        b1.setUserId(222);
        playerMap.put(b1.getSeq(), b1);
        Player b2 = new Player(202);
        b2.setX(5);
        b2.setY(3);
        b2.setHp(20);
        b2.setUserId(222);
        playerMap.put(b2.getSeq(), b2);
        Player c1 = new Player(301);
        c1.setX(18);
        c1.setY(3);
        c1.setHp(20);
        c1.setUserId(333);
        playerMap.put(c1.getSeq(), c1);
        Player c2 = new Player(302);
        c2.setX(20);
        c2.setY(5);
        c2.setHp(20);
        c2.setUserId(333);
        playerMap.put(c2.getSeq(), c2);
        Player d1 = new Player(401);
        d1.setX(18);
        d1.setY(20);
        d1.setHp(20);
        d1.setUserId(444);
        playerMap.put(d1.getSeq(), d1);
        Player d2 = new Player(402);
        d2.setX(20);
        d2.setY(18);
        d2.setHp(20);
        d2.setUserId(444);
        playerMap.put(d2.getSeq(), d2);
    }

    @Override
    protected void beforeStart() {
        logger.info("[" + id + "] 已启动", id);
        BattleRecordPO record = new BattleRecordPO();
        record.setId(id);
        record.setStatus(status);
        battleRecordDAO.update(record);
        saveStep();
    }

    @Override
    protected boolean doStep() {
        for (Player p : playerMap.values()) {
            boolean isValid = false;
            while (!isValid) {
                Random random = new Random();
                int dx = 0, dy = 0;
                switch (random.nextInt(4)) {
                    case 0:
                        dx = 1; dy = 0;
                        break;
                    case 1:
                        dx = 0; dy = 1;
                        break;
                    case 2:
                        dx = -1; dy = 0;
                        break;
                    case 3:
                        dx = 0; dy = -1;
                        break;
                }
                int nx = p.getX() + dx;
                int ny = p.getY() + dy;
                if (nx > 0 && nx < BattleConfigManager.GRID_X - 1 && ny > 0 && ny < BattleConfigManager.GRID_Y - 1) {
                    for (Player p2 : playerMap.values()) {
                        if (BattleUtils.isSameGrid(p, p2)) {
                            break;
                        }
                    }
                    isValid = true;
                    p.move(dx, dy);
                }
            }
        }

        for (Player rooney : playerMap.values()) {
            Player target = null;
            List<Player> enemyList = playerMap.values().stream().collect(Collectors.toList());
            Collections.shuffle(enemyList);
            for (Player enemy : enemyList) {
                if (enemy.getStatus() != PlayerStatus.DEAD.getCode() && enemy.getUserId() != rooney.getUserId()) {
                    target = enemy;
                    continue;
                }
            }
            if (target != null) {
                rooney.cast(new Flyer(999, rooney.getX(), rooney.getY(), target.getX(), target.getY(), 2, 1));
            }
        }

        Iterator<Map.Entry<Long, Flyer>> it = flyerMap.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<Long, Flyer> entry = it.next();
            if (entry.getValue().getStatus() == EffectStatus.FINISH.getCode()) {
                it.remove();
            }
        }

        for (Flyer f: flyerMap.values()) {
            f.cast();
            for (Player p : playerMap.values()) {
                if (BattleUtils.isSameGrid(f, p)) {
                    if (f.getOwner() == p.getSeq()) {
                        continue;
                    }
                    f.finish();
                    if (p.getStatus() == PlayerStatus.DEAD.getCode() || playerMap.get(f.getOwner()).getUserId() == p.getUserId()) {
                        continue;
                    }
                    f.addEffect(p);
                }
            }
        }

        saveStep();

        Set<Long> team = new HashSet<>();
        for (Player p: playerMap.values()) {
            if (p.getStatus() != PlayerStatus.DEAD.getCode()) {
                team.add(p.getUserId());
            }
        }

        if (team.size() > 1) {
            return true;
        } else {
            return !flyerMap.isEmpty();
        }
    }

    @Override
    protected void afterFinish() {
        logger.info("[" + id + "] 已完成", id);
        BattleRecordPO record = new BattleRecordPO();
        record.setId(id);
        record.setStatus(status);
        record.setResult(JSON.toJSONString(history, SerializerFeature.DisableCircularReferenceDetect));

        Set<Long> team = new HashSet<>();
        for (Player p: playerMap.values()) {
            if (p.getStatus() != PlayerStatus.DEAD.getCode()) {
                team.add(p.getUserId());
            }
        }

        if (team.size() == 1) {
            record.setWinner(team.iterator().next());
        }

        battleRecordDAO.update(record);
    }

    private void saveStep() {
        BattleContextDTO battleContextDTO = new BattleContextDTO();
        battleContextDTO.setStep(currentStep);
        battleContextDTO.setPlayers(CopyUtils.copyObjects(playerMap, Player.class));
        battleContextDTO.setFlyers(CopyUtils.copyObjects(flyerMap, Flyer.class));
        history.add(battleContextDTO);
    }


    public List<BattleContextDTO> getHistory() {
        return history;
    }

    public void setHistory(List<BattleContextDTO> history) {
        this.history = history;
    }

    public Map<Long, Player> getPlayerMap() {
        return playerMap;
    }

    public void setPlayerMap(Map<Long, Player> playerMap) {
        this.playerMap = playerMap;
    }

    public Map<Long, Flyer> getFlyerMap() {
        return flyerMap;
    }

    public void setFlyerMap(Map<Long, Flyer> flyerMap) {
        this.flyerMap = flyerMap;
    }
}
