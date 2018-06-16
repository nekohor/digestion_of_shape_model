# 板形模型消化

* [GSM总览](docs/anatomy/gsm_anatomy.md)

## SSU板形设定模型

* [SSU板形设定模型总览](docs/ssu/ssu_overview.md)
    * [板形模型初始化](docs/ssu/ssu_init.md)
    * [包络线计算](docs/ssu/ssu_env.md)
    * [凸度分配计算](docs/ssu/ssu_alc.md)
    * [板形评估](docs/ssu/ssu_elv.md)
* [板形物理模型](docs/ssu/ssu_physical_model.md)
* [偏导数参数或增益](docs/ssu/ssu_xfer_func.md)

## 凸度分配

* [凸度分配和浪形的关系](docs/allocation/allocation_overview.md)
    * [道次出口目标计算](docs/allocation/delivery_pass_targets.md)
    * [辊系凸度计算](docs/allocation/roll_stack_crowns.md)
    * [UFD均载辊缝凸度计算](docs/allocation/UFD_calc.md)
    <!-- * [2.4 CVC等效凸度计算](docs/allocation/roll_grnd_calc.md) -->
    <!-- * [2.5 窜辊设定计算](docs/allocation/pos_shft_actuator.md) -->
    <!-- * [2.6 弯辊设定计算](docs/allocation/bend_frc_actuator.md) -->
    <!-- * [2.7 凸度分配迭代计算](docs/allocation/alc_cycle_calc.md) -->

## 重难点模块与问题

* [重难点模块与问题](docs/submodel/submodel_overview.md)
    <!-- * [3.1 空载辊缝模型](docs/submodel/unloaded_roll_gap_model.md) -->
    <!-- * [3.2 有载辊缝模型](docs/submodel/loaded_roll_gap_model.md) -->
    * [LPCE横向带钢模型](docs/submodel/LPCE_model.md)
    * [LRG横向辊缝模型](docs/submodel/LRG_model.md)
    <!-- * [3.5 临界浪形模型](docs/submodel/critical_buckling_model.md) -->
    <!-- * [3.6 TARGT模块](docs/submodel/TARGT_model.md) -->
    * [ALC模块](docs/submodel/ALC_model.md)
    * [CRLC模块](docs/submodel/CRLC_model.md)
    * [CVC辊形设计](docs/submodel/cvc_roll_design.md)

## 板形自学习

* [SMLC板形自学习模型](docs/smlc/smlc_overview.md)
    <!-- * [4.1 自学习策略](docs/smlc/adapt_strategy.md) -->
    <!-- * [4.2 辊系凸度补偿](docs/smlc/wr_crn_off.md) -->
    <!-- * [4.3 凸度自学习](docs/smlc/profile_adapt.md) -->
    * [平直度自学习](docs/smlc/flatness_adapt.md)
    <!-- * [4.5 有效单位凸度自学习](docs/smlc/eff_pu_profile_adapt.md) -->


## ROP

<!-- * [ROP轧辊模型](docs/rop/rop_overview.md) -->
    <!-- * [ROP磨损](docs/rop/rop_wear.md) -->
    <!-- * [ROP热胀](docs/rop/rop_thermal.md) -->

## SCF

<!-- * [6 SCF平辊窜辊策略模型](docs/scf/scf_overview.md) -->
    <!-- * [6.1 常规辊形窜辊](docs/scf/scf_normal.md) -->
    <!-- * [6.2 正弦异步窜辊](docs/scf/scf_sin.md) -->

## 板形动态控制

* [板形动态控制总览](docs/dynamic_control/dynamic_control_overview.md)
    <!-- * [ASPC凸度反馈控制](docs/dynamic_control/aspc.md) -->
    <!-- * [ASFC浪形反馈控制](docs/dynamic_control/asfc.md) -->
    <!-- * [FFC轧制力跟随控制](docs/dynamic_control/ffc.md) -->
    <!-- * [TCFC热胀跟随控制](docs/dynamic_control/tcfc.md) -->

## 参数和日志

* [参数和日志总览](docs/parameters/parameters_overview.md)
    * [SSU参数日志验算](docs/parameters/ssu_log_checking_calculation.md)
    * [SSU参数日志FAQ](docs/parameters/ssu_log_FAQ.md)
    * [CFG模型参数梳理](docs/parameters/cfg_parameters.md)
    * [CTool参数梳理](docs/parameters/ctool_gsm.md)

## 板形模型实战

* [实战！](docs/actual_combat/actual_combat_overview.md)
    * [目标凸度变化影响板形模型设定](docs/actual_combat/target_crown_change_has_influence_on_shape_model_references.md)
    <!-- * [板形能力校核](docs/actual_combat/shape_ability_checking.md) -->
    <!-- * [正弦异步窜辊策略的调整](docs/actual_combat/正弦异步窜辊策略的调整.md) -->
    <!-- * [热轧目标凸度对硅钢同板差的影响](docs/actual_combat/热轧目标凸度对硅钢同板差的影响.md) -->

