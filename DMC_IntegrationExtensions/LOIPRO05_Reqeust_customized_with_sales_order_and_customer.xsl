<?xml version='1.0' ?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xpath-default-namespace="urn:sap-com:document:sap:idoc:soap:messages">
    <xsl:template match="/LOIPRO05">
        <productionOrderIn>
            <xsl:variable name="reworkOrderCodes">|RW01|RW02|</xsl:variable>
            <xsl:variable name="plant" select="IDOC/E1AFKOL/WERKS"/>
            <xsl:variable name="routing">
                <xsl:variable name="POValue" select="IDOC/E1AFKOL/AUFNR"/>
                <xsl:call-template name="addShopOrder">
                    <xsl:with-param name="shopOrder" select="$POValue"/>
                </xsl:call-template>
            </xsl:variable>
            <xsl:variable name="PO_STATUS_FLAG">
                <xsl:for-each select="IDOC/E1AFKOL/E1JSTKL">
                    <xsl:variable name="PO_STATUS" select="STAT"/>
                    <xsl:if test="$PO_STATUS='I0012' or $PO_STATUS='I0045' or $PO_STATUS='I0076'">TRUE</xsl:if>
                </xsl:for-each>
            </xsl:variable>
            <xsl:variable name="material">
                <xsl:call-template name="addMaterial">
                    <xsl:with-param name="material" select="IDOC/E1AFKOL/MATNR"/>
                    <xsl:with-param name="materialExt" select="IDOC/E1AFKOL/MATNR_EXTERNAL"/>
                    <xsl:with-param name="materialLong" select="IDOC/E1AFKOL/MATNR_LONG"/>
                </xsl:call-template>
            </xsl:variable>

            <!--Plant -->
            <plant>
                <xsl:value-of select="$plant"/>
            </plant>

            <!-- shopOrderReleaseQuantity sample -->
            <!--
            <shopOrderReleaseQuantity>all</shopOrderReleaseQuantity>
            -->

            <!-- Shop Order -->
            <shopOrderIn>
                <shopOrder>
                    <xsl:variable name="POValue" select="IDOC/E1AFKOL/AUFNR"/>
                    <xsl:call-template name="addShopOrder">
                        <xsl:with-param name="shopOrder" select="$POValue"/>
                    </xsl:call-template>
                </shopOrder>
                <warehouseNumber>
                	<xsl:value-of select="IDOC/E1AFKOL/E1AFPOL/LGNUM"/>
                </warehouseNumber>
                <erpPutawayStorageLocation>
                    <xsl:value-of select="IDOC/E1AFKOL/E1AFPOL/LGORT"/>
                </erpPutawayStorageLocation>
                <batchNumber>
                    <xsl:value-of select="IDOC/E1AFKOL/E1AFPOL/CHARG"/>
                </batchNumber>
                <plannedMaterialDTO>
                    <material>
                        <xsl:value-of select="$material"/>
                    </material>
                </plannedMaterialDTO>
                <xsl:variable name="priority" select="IDOC/E1AFKOL/APRIO"/>
                <xsl:if test="string-length(IDOC/E1AFKOL/APRIO) &gt; '0'">
                    <xsl:choose>
                        <xsl:when test="number($priority)">
                            <priority>
                                <xsl:value-of select="number($priority)"/>
                            </priority>
                        </xsl:when>
                        <xsl:otherwise>
                            <priority>500</priority>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:if>
                <xsl:if test="string-length(IDOC/E1AFKOL/APRIO) = '0'">
                    <priority>500</priority>
                </xsl:if>
                <plannedStartDate>
                    <xsl:variable name="plannedStartDate" select="IDOC/E1AFKOL/GSTRP"/>
                    <xsl:variable name="plannedStartDateTime" select="IDOC/E1AFKOL/GSUZP"/>
                    <xsl:choose>
                        <xsl:when test="string($plannedStartDateTime)">
                            <xsl:value-of select="concat(substring($plannedStartDate, 1, 4), '-', substring($plannedStartDate, 5, 2), '-', substring($plannedStartDate, 7, 2), 'T', substring($plannedStartDateTime, 1, 2), ':',substring($plannedStartDateTime, 3, 2),':',substring($plannedStartDateTime, 5, 2) )"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="concat(substring($plannedStartDate, 1, 4), '-', substring($plannedStartDate, 5, 2), '-', substring($plannedStartDate, 7, 2), 'T00:00:01')"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </plannedStartDate>
                <plannedCompleteDate>
                    <xsl:variable name="plannedCompDate" select="IDOC/E1AFKOL/GLTRP"/>
                    <xsl:variable name="plannedCompDateTime" select="IDOC/E1AFKOL/GLUZP"/>
                    <xsl:choose>
                        <xsl:when test="string($plannedCompDateTime)">
                            <xsl:value-of select="concat(substring($plannedCompDate, 1, 4), '-', substring($plannedCompDate, 5, 2), '-', substring($plannedCompDate, 7, 2), 'T', substring($plannedCompDateTime, 1, 2), ':',substring($plannedCompDateTime, 3, 2),':',substring($plannedCompDateTime, 5, 2) )"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="concat(substring($plannedCompDate, 1, 4), '-', substring($plannedCompDate, 5, 2), '-', substring($plannedCompDate, 7, 2), 'T23:59:59')"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </plannedCompleteDate>
                <scheduledStartDate>
                    <xsl:variable name="scheduledStartDate" select="IDOC/E1AFKOL/GSTRS"/>
                    <xsl:variable name="scheduledStartDateTime" select="IDOC/E1AFKOL/GSUZS"/>
                    <xsl:choose>
                        <xsl:when test="string($scheduledStartDateTime)">
                            <xsl:value-of select="concat(substring($scheduledStartDate, 1, 4), '-', substring($scheduledStartDate, 5, 2), '-', substring($scheduledStartDate, 7, 2), 'T', substring($scheduledStartDateTime, 1, 2), ':',substring($scheduledStartDateTime, 3, 2),':',substring($scheduledStartDateTime, 5, 2) )"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="concat(substring($scheduledStartDate, 1, 4), '-', substring($scheduledStartDate, 5, 2), '-', substring($scheduledStartDate, 7, 2), 'T00:00:01')"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </scheduledStartDate>
                <scheduledCompleteDate>
                    <xsl:variable name="scheduledCompDate" select="IDOC/E1AFKOL/GLTRS"/>
                    <xsl:variable name="scheduledCompDateTime" select="IDOC/E1AFKOL/GLUZS"/>
                    <xsl:choose>
                        <xsl:when test="string($scheduledCompDateTime)">
                            <xsl:value-of select="concat(substring($scheduledCompDate, 1, 4), '-', substring($scheduledCompDate, 5, 2), '-', substring($scheduledCompDate, 7, 2), 'T', substring($scheduledCompDateTime, 1, 2), ':',substring($scheduledCompDateTime, 3, 2),':',substring($scheduledCompDateTime, 5, 2) )"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="concat(substring($scheduledCompDate, 1, 4), '-', substring($scheduledCompDate, 5, 2), '-', substring($scheduledCompDate, 7, 2), 'T23:59:59')"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </scheduledCompleteDate>
                <quantityToBuild>
                    <xsl:value-of select="floor(IDOC/E1AFKOL/BMENGE)"/>
                </quantityToBuild>
                <quantityOrdered>
                    <xsl:value-of select="floor(IDOC/E1AFKOL/BMENGE)"/>
                </quantityOrdered>
                <!-- Customer -->
                <xsl:if test="IDOC/E1AFKOL/E1AFPOL[POSNR='0001']/KUNAG != '' and IDOC/E1AFKOL/E1AFPOL[POSNR='0001']/NAME1 != ''">
                    <erpCustomerIn>
                        <customer>
                            <xsl:value-of select="IDOC/E1AFKOL/E1AFPOL[POSNR='0001']/KUNAG"/>
                        </customer>
                        <customerName>
                            <xsl:value-of select="IDOC/E1AFKOL/E1AFPOL[POSNR='0001']/NAME1"/>
                        </customerName>
                    </erpCustomerIn>
                </xsl:if>
                <!-- Customer order -->
                <xsl:if test="IDOC/E1AFKOL/E1AFPOL[POSNR='0001']/KDAUF">
                    <erpCustomerOrderIn>
                        <customerOrder>
                            <xsl:value-of select="IDOC/E1AFKOL/E1AFPOL[POSNR='0001']/KDAUF"/>
                        </customerOrder>
                        <xsl:if test="IDOC/E1AFKOL/E1AFPOL[POSNR='0001']/KDPOS">
                            <customerOrderItem>
                                <xsl:value-of select="IDOC/E1AFKOL/E1AFPOL[POSNR='0001']/KDPOS"/>
                            </customerOrderItem>
                        </xsl:if>
                    </erpCustomerOrderIn>
                </xsl:if>
                <xsl:if test="IDOC/E1AFKOL/STLAN != '' and IDOC/E1AFKOL/STLAL != ''">
                    <plannedBomDTO>
                        <bom>
                            <!--
                            <xsl:call-template name="addBomName">
                                <xsl:with-param name="material" select="IDOC/E1AFKOL/MATNR"/>
                                <xsl:with-param name="materialExt" select="IDOC/E1AFKOL/MATNR_EXTERNAL"/>
                                <xsl:with-param name="materialLong" select="IDOC/E1AFKOL/MATNR_LONG"/>
                                <xsl:with-param name="usage" select="IDOC/E1AFKOL/STLAN"/>
                                <xsl:with-param name="altBom" select="IDOC/E1AFKOL/STLAL"/>
                            </xsl:call-template>
                            -->
                            <xsl:variable name="POValue" select="IDOC/E1AFKOL/AUFNR"/>
                            <xsl:call-template name="addShopOrder">
                                <xsl:with-param name="shopOrder" select="$POValue"/>
                            </xsl:call-template>
                        </bom>
                    </plannedBomDTO>
                </xsl:if>
                <plannedRoutingDTO>
                    <routing>
                        <xsl:value-of select="$routing"/>
                    </routing>
                </plannedRoutingDTO>
                <erpUnitOfMeasure>
                    <xsl:value-of select="IDOC/E1AFKOL/BMEINS"/>
                </erpUnitOfMeasure>
                <shopOrderSfcPlanDTOList>
                    <xsl:for-each select="IDOC/E1AFKOL/E1AFPOL/E1AFSER">
                        <shopOrderSfcPlanDTO>
                            <xsl:if test="not(contains($reworkOrderCodes,concat('|', ../../AUART, '|')))">
                                <sfc>
                                    <xsl:value-of select="concat($material, '-', SERNR)"/>
                                </sfc>
                            </xsl:if>
                            <serialNumber>
                                <xsl:value-of select="SERNR"/>
                            </serialNumber>
                        </shopOrderSfcPlanDTO>
                    </xsl:for-each>
                </shopOrderSfcPlanDTOList>
                <shopOrderScheduleDTOList>
                    <xsl:for-each select="IDOC/E1AFKOL/E1AFFLL/E1AFVOL">
                        <xsl:variable name="stepCounter" select="position()"/>
                        <xsl:choose>
                            <xsl:when test="E1KBEDL[SPLIT!='0']">
                                <xsl:variable name="parentCapacityId" select="E1KBEDL[SPLIT='0']/KAPID"/>
                                <xsl:for-each select="E1KBEDL[SPLIT!='0']">
                                    <xsl:variable name="splitCounter" select="position()"/>
                                    <shopOrderScheduleDTO>
                                        <stepId>
                                            <xsl:choose>
                                                <xsl:when test="../VORNR">
                                                    <xsl:value-of select="../VORNR"/>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                    <xsl:number value="$stepCounter*10" format="1"/>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </stepId>
                                        <sequence>
                                            <xsl:number value="$splitCounter*10" format="1"/>
                                        </sequence>
                                        <xsl:if test="KAPNAME">
                                            <resource>
                                                <xsl:value-of select="KAPNAME"/>
                                            </resource>
                                        </xsl:if>
                                        <xsl:if test="not(KAPID=$parentCapacityId)">
                                            <resourceErpInternalId>
                                                <xsl:value-of select="KAPID"/>
                                            </resourceErpInternalId>
                                        </xsl:if>
                                        <splitId>
                                            <xsl:value-of select="SPLIT"/>
                                        </splitId>
                                        <plannedQuantity>
                                            <xsl:value-of select="floor(MGVRG)"/>
                                        </plannedQuantity>
                                        <startDate>
                                            <xsl:variable name="startDate" select="FSTAD"/>
                                            <xsl:variable name="startDateTime" select="FSTAU"/>
                                            <xsl:choose>
                                                <xsl:when test="string($startDateTime)">
                                                    <xsl:value-of select="concat(substring($startDate, 1, 4), '-', substring($startDate, 5, 2), '-', substring($startDate, 7, 2), 'T', substring($startDateTime, 1, 2), ':',substring($startDateTime, 3, 2),':',substring($startDateTime, 5, 2) )"/>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                    <xsl:value-of select="concat(substring($startDate, 1, 4), '-', substring($startDate, 5, 2), '-', substring($startDate, 7, 2), 'T00:00:01')"/>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </startDate>
                                        <endDate>
                                            <xsl:variable name="endDate" select="FENDD"/>
                                            <xsl:variable name="endDateTime" select="FENDU"/>
                                            <xsl:choose>
                                                <xsl:when test="string($endDateTime)">
                                                    <xsl:value-of select="concat(substring($endDate, 1, 4), '-', substring($endDate, 5, 2), '-', substring($endDate, 7, 2), 'T', substring($endDateTime, 1, 2), ':',substring($endDateTime, 3, 2),':',substring($endDateTime, 5, 2) )"/>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                    <xsl:value-of select="concat(substring($endDate, 1, 4), '-', substring($endDate, 5, 2), '-', substring($endDate, 7, 2), 'T00:00:01')"/>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </endDate>

                                        <earliestSetupStartDate>
                                            <xsl:variable name="setupStartDate" select="FSAVD"/>
                                            <xsl:variable name="setupStartDateTime" select="FSAVZ"/>
                                            <xsl:variable name="millionSecond" select="RUEST"/>
                                            <xsl:choose>
                                                <xsl:when test="string($setupStartDateTime)">
                                                    <xsl:choose>
                                                        <xsl:when test="string($millionSecond)">
                                                            <xsl:value-of select="concat(substring($setupStartDate, 1, 4), '-', substring($setupStartDate, 5, 2), '-', substring($setupStartDate, 7, 2), 'T', substring($setupStartDateTime, 1, 2), ':',substring($setupStartDateTime, 3, 2),':',substring($setupStartDateTime, 5, 2), '.' ,substring-after(substring-before($millionSecond, 'E'), '.') )"/>
                                                        </xsl:when>
                                                        <xsl:otherwise>
                                                            <xsl:value-of select="concat(substring($setupStartDate, 1, 4), '-', substring($setupStartDate, 5, 2), '-', substring($setupStartDate, 7, 2), 'T', substring($setupStartDateTime, 1, 2), ':',substring($setupStartDateTime, 3, 2),':',substring($setupStartDateTime, 5, 2) )"/>
                                                        </xsl:otherwise>
                                                    </xsl:choose>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                    <xsl:value-of select="concat(substring($setupStartDate, 1, 4), '-', substring($setupStartDate, 5, 2), '-', substring($setupStartDate, 7, 2), 'T00:00:01')"/>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </earliestSetupStartDate>
                                        <latestSetupStartDate>
                                            <xsl:variable name="setupStartDate" select="FSAVD"/>
                                            <xsl:variable name="setupStartDateTime" select="FSAVZ"/>
                                            <xsl:variable name="millionSecond" select="RUEST"/>
                                            <xsl:choose>
                                                <xsl:when test="string($setupStartDateTime)">
                                                    <xsl:choose>
                                                        <xsl:when test="string($millionSecond)">
                                                            <xsl:value-of select="concat(substring($setupStartDate, 1, 4), '-', substring($setupStartDate, 5, 2), '-', substring($setupStartDate, 7, 2), 'T', substring($setupStartDateTime, 1, 2), ':',substring($setupStartDateTime, 3, 2),':',substring($setupStartDateTime, 5, 2), '.' ,substring-after(substring-before($millionSecond, 'E'), '.') )"/>
                                                        </xsl:when>
                                                        <xsl:otherwise>
                                                            <xsl:value-of select="concat(substring($setupStartDate, 1, 4), '-', substring($setupStartDate, 5, 2), '-', substring($setupStartDate, 7, 2), 'T', substring($setupStartDateTime, 1, 2), ':',substring($setupStartDateTime, 3, 2),':',substring($setupStartDateTime, 5, 2) )"/>
                                                        </xsl:otherwise>
                                                    </xsl:choose>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                    <xsl:value-of select="concat(substring($setupStartDate, 1, 4), '-', substring($setupStartDate, 5, 2), '-', substring($setupStartDate, 7, 2), 'T00:00:01')"/>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </latestSetupStartDate>

                                        <earliestProcessingStartDate>
                                            <xsl:variable name="processStartDate" select="FSSBD"/>
                                            <xsl:variable name="processStartDateTime" select="FSSBZ"/>
                                            <xsl:choose>
                                                <xsl:when test="string($processStartDateTime)">
                                                    <xsl:value-of select="concat(substring($processStartDate, 1, 4), '-', substring($processStartDate, 5, 2), '-', substring($processStartDate, 7, 2), 'T', substring($processStartDateTime, 1, 2), ':',substring($processStartDateTime, 3, 2),':',substring($processStartDateTime, 5, 2) )"/>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                    <xsl:value-of select="concat(substring($processStartDate, 1, 4), '-', substring($processStartDate, 5, 2), '-', substring($processStartDate, 7, 2), 'T00:00:01')"/>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </earliestProcessingStartDate>
                                        <latestProcessingStartDate>
                                            <xsl:variable name="processStartDate" select="FSSBD"/>
                                            <xsl:variable name="processStartDateTime" select="FSSBZ"/>
                                            <xsl:choose>
                                                <xsl:when test="string($processStartDateTime)">
                                                    <xsl:value-of select="concat(substring($processStartDate, 1, 4), '-', substring($processStartDate, 5, 2), '-', substring($processStartDate, 7, 2), 'T', substring($processStartDateTime, 1, 2), ':',substring($processStartDateTime, 3, 2),':',substring($processStartDateTime, 5, 2) )"/>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                    <xsl:value-of select="concat(substring($processStartDate, 1, 4), '-', substring($processStartDate, 5, 2), '-', substring($processStartDate, 7, 2), 'T00:00:01')"/>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </latestProcessingStartDate>

                                        <earliestTeardownStartDate>
                                            <xsl:variable name="teardownStartDate" select="FSSAD"/>
                                            <xsl:variable name="teardownStartDateTime" select="FSSAZ"/>
                                            <xsl:choose>
                                                <xsl:when test="string($teardownStartDateTime)">
                                                    <xsl:value-of select="concat(substring($teardownStartDate, 1, 4), '-', substring($teardownStartDate, 5, 2), '-', substring($teardownStartDate, 7, 2), 'T', substring($teardownStartDateTime, 1, 2), ':',substring($teardownStartDateTime, 3, 2),':',substring($teardownStartDateTime, 5, 2) )"/>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                    <xsl:value-of select="concat(substring($teardownStartDate, 1, 4), '-', substring($teardownStartDate, 5, 2), '-', substring($teardownStartDate, 7, 2), 'T00:00:01')"/>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </earliestTeardownStartDate>
                                        <latestTeardownStartDate>
                                            <xsl:variable name="teardownStartDate" select="FSSAD"/>
                                            <xsl:variable name="teardownStartDateTime" select="FSSAZ"/>
                                            <xsl:choose>
                                                <xsl:when test="string($teardownStartDateTime)">
                                                    <xsl:value-of select="concat(substring($teardownStartDate, 1, 4), '-', substring($teardownStartDate, 5, 2), '-', substring($teardownStartDate, 7, 2), 'T', substring($teardownStartDateTime, 1, 2), ':',substring($teardownStartDateTime, 3, 2),':',substring($teardownStartDateTime, 5, 2) )"/>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                    <xsl:value-of select="concat(substring($teardownStartDate, 1, 4), '-', substring($teardownStartDate, 5, 2), '-', substring($teardownStartDate, 7, 2), 'T00:00:01')"/>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </latestTeardownStartDate>

                                        <earliestTeardownEndDate>
                                            <xsl:variable name="teardownEndDate" select="SSEVD"/>
                                            <xsl:variable name="teardownEndDateTime" select="SSEVZ"/>
                                            <xsl:choose>
                                                <xsl:when test="string($teardownEndDateTime)">
                                                    <xsl:value-of select="concat(substring($teardownEndDate, 1, 4), '-', substring($teardownEndDate, 5, 2), '-', substring($teardownEndDate, 7, 2), 'T', substring($teardownEndDateTime, 1, 2), ':',substring($teardownEndDateTime, 3, 2),':',substring($teardownEndDateTime, 5, 2) )"/>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                    <xsl:value-of select="concat(substring($teardownEndDate, 1, 4), '-', substring($teardownEndDate, 5, 2), '-', substring($teardownEndDate, 7, 2), 'T00:00:01')"/>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </earliestTeardownEndDate>
                                        <latestTeardownEndDate>
                                            <xsl:variable name="teardownEndDate" select="SSEVD"/>
                                            <xsl:variable name="teardownEndDateTime" select="SSEVZ"/>
                                            <xsl:choose>
                                                <xsl:when test="string($teardownEndDateTime)">
                                                    <xsl:value-of select="concat(substring($teardownEndDate, 1, 4), '-', substring($teardownEndDate, 5, 2), '-', substring($teardownEndDate, 7, 2), 'T', substring($teardownEndDateTime, 1, 2), ':',substring($teardownEndDateTime, 3, 2),':',substring($teardownEndDateTime, 5, 2) )"/>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                    <xsl:value-of select="concat(substring($teardownEndDate, 1, 4), '-', substring($teardownEndDate, 5, 2), '-', substring($teardownEndDate, 7, 2), 'T00:00:01')"/>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </latestTeardownEndDate>

                                        <earliestWaitingEndDate>
                                            <xsl:variable name="waitingEndDate" select="FSSLD"/>
                                            <xsl:variable name="waitingEndDateTime" select="FSSLZ"/>
                                            <xsl:choose>
                                                <xsl:when test="string($waitingEndDateTime)">
                                                    <xsl:value-of select="concat(substring($waitingEndDate, 1, 4), '-', substring($waitingEndDate, 5, 2), '-', substring($waitingEndDate, 7, 2), 'T', substring($waitingEndDateTime, 1, 2), ':',substring($waitingEndDateTime, 3, 2),':',substring($waitingEndDateTime, 5, 2) )"/>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                    <xsl:value-of select="concat(substring($waitingEndDate, 1, 4), '-', substring($waitingEndDate, 5, 2), '-', substring($waitingEndDate, 7, 2), 'T00:00:01')"/>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </earliestWaitingEndDate>
                                        <latestWaitingEndDate>
                                            <xsl:variable name="waitingEndDate" select="FSSLD"/>
                                            <xsl:variable name="waitingEndDateTime" select="FSSLZ"/>
                                            <xsl:choose>
                                                <xsl:when test="string($waitingEndDateTime)">
                                                    <xsl:value-of select="concat(substring($waitingEndDate, 1, 4), '-', substring($waitingEndDate, 5, 2), '-', substring($waitingEndDate, 7, 2), 'T', substring($waitingEndDateTime, 1, 2), ':',substring($waitingEndDateTime, 3, 2),':',substring($waitingEndDateTime, 5, 2) )"/>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                    <xsl:value-of select="concat(substring($waitingEndDate, 1, 4), '-', substring($waitingEndDate, 5, 2), '-', substring($waitingEndDate, 7, 2), 'T00:00:01')"/>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </latestWaitingEndDate>

                                        <planSetupTime>
                                            <xsl:value-of select="RUEST"/>
                                        </planSetupTime>
                                        <planProcessingTime>
                                            <xsl:value-of select="BEARZ"/>
                                        </planProcessingTime>
                                        <planTeardownTime>
                                            <xsl:value-of select="ABRUE"/>
                                        </planTeardownTime>
                                        <setupTimeUom>
                                            <xsl:value-of select="RSTZE"/>
                                        </setupTimeUom>
                                        <processingTimeUom>
                                            <xsl:value-of select="BEAZE"/>
                                        </processingTimeUom>
                                        <teardownTimeUom>
                                            <xsl:value-of select="ARZUE"/>
                                        </teardownTimeUom>
                                    </shopOrderScheduleDTO>
                                </xsl:for-each>
                            </xsl:when>
                            <xsl:otherwise>
                                <shopOrderScheduleDTO>
                                    <stepId>
                                        <xsl:choose>
                                            <xsl:when test="VORNR">
                                                <xsl:value-of select="VORNR"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:number value="$stepCounter*10" format="1"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </stepId>
                                    <sequence>10</sequence>
                                    <splitId>OPS</splitId>
                                    <plannedQuantity>
                                        <xsl:value-of select="floor(../../BMENGE)"/>
                                    </plannedQuantity>
                                    <startDate>
                                        <xsl:variable name="startDate" select="FSSBD"/>
                                        <xsl:variable name="startDateTime" select="FSSBZ"/>
                                        <xsl:choose>
                                            <xsl:when test="string($startDateTime)">
                                                <xsl:value-of select="concat(substring($startDate, 1, 4), '-', substring($startDate, 5, 2), '-', substring($startDate, 7, 2), 'T', substring($startDateTime, 1, 2), ':',substring($startDateTime, 3, 2),':',substring($startDateTime, 5, 2) )"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="concat(substring($startDate, 1, 4), '-', substring($startDate, 5, 2), '-', substring($startDate, 7, 2), 'T00:00:01')"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </startDate>
                                    <endDate>
                                        <xsl:variable name="endDate" select="FSSAD"/>
                                        <xsl:variable name="endDateTime" select="FSSAZ"/>
                                        <xsl:choose>
                                            <xsl:when test="string($endDateTime)">
                                                <xsl:value-of select="concat(substring($endDate, 1, 4), '-', substring($endDate, 5, 2), '-', substring($endDate, 7, 2), 'T', substring($endDateTime, 1, 2), ':',substring($endDateTime, 3, 2),':',substring($endDateTime, 5, 2) )"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="concat(substring($endDate, 1, 4), '-', substring($endDate, 5, 2), '-', substring($endDate, 7, 2), 'T00:00:01')"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </endDate>

                                    <earliestSetupStartDate>
                                        <xsl:variable name="setupStartDate" select="FSAVD"/>
                                        <xsl:variable name="setupStartDateTime" select="FSAVZ"/>
                                        <xsl:variable name="millionSecond" select="RUEST"/>
                                        <xsl:choose>
                                            <xsl:when test="string($setupStartDateTime)">
                                                <xsl:choose>
                                                    <xsl:when test="string($millionSecond)">
                                                        <xsl:value-of select="concat(substring($setupStartDate, 1, 4), '-', substring($setupStartDate, 5, 2), '-', substring($setupStartDate, 7, 2), 'T', substring($setupStartDateTime, 1, 2), ':',substring($setupStartDateTime, 3, 2),':',substring($setupStartDateTime, 5, 2), '.' ,substring-after(substring-before($millionSecond, 'E'), '.') )"/>
                                                    </xsl:when>
                                                    <xsl:otherwise>
                                                        <xsl:value-of select="concat(substring($setupStartDate, 1, 4), '-', substring($setupStartDate, 5, 2), '-', substring($setupStartDate, 7, 2), 'T', substring($setupStartDateTime, 1, 2), ':',substring($setupStartDateTime, 3, 2),':',substring($setupStartDateTime, 5, 2) )"/>
                                                    </xsl:otherwise>
                                                </xsl:choose>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="concat(substring($setupStartDate, 1, 4), '-', substring($setupStartDate, 5, 2), '-', substring($setupStartDate, 7, 2), 'T00:00:01')"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </earliestSetupStartDate>
                                    <latestSetupStartDate>
                                        <xsl:variable name="setupStartDate" select="FSAVD"/>
                                        <xsl:variable name="setupStartDateTime" select="FSAVZ"/>
                                        <xsl:variable name="millionSecond" select="RUEST"/>
                                        <xsl:choose>
                                            <xsl:when test="string($setupStartDateTime)">
                                                <xsl:choose>
                                                    <xsl:when test="string($millionSecond)">
                                                        <xsl:value-of select="concat(substring($setupStartDate, 1, 4), '-', substring($setupStartDate, 5, 2), '-', substring($setupStartDate, 7, 2), 'T', substring($setupStartDateTime, 1, 2), ':',substring($setupStartDateTime, 3, 2),':',substring($setupStartDateTime, 5, 2), '.' ,substring-after(substring-before($millionSecond, 'E'), '.') )"/>
                                                    </xsl:when>
                                                    <xsl:otherwise>
                                                        <xsl:value-of select="concat(substring($setupStartDate, 1, 4), '-', substring($setupStartDate, 5, 2), '-', substring($setupStartDate, 7, 2), 'T', substring($setupStartDateTime, 1, 2), ':',substring($setupStartDateTime, 3, 2),':',substring($setupStartDateTime, 5, 2) )"/>
                                                    </xsl:otherwise>
                                                </xsl:choose>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="concat(substring($setupStartDate, 1, 4), '-', substring($setupStartDate, 5, 2), '-', substring($setupStartDate, 7, 2), 'T00:00:01')"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </latestSetupStartDate>

                                    <earliestProcessingStartDate>
                                        <xsl:variable name="processStartDate" select="FSSBD"/>
                                        <xsl:variable name="processStartDateTime" select="FSSBZ"/>
                                        <xsl:choose>
                                            <xsl:when test="string($processStartDateTime)">
                                                <xsl:value-of select="concat(substring($processStartDate, 1, 4), '-', substring($processStartDate, 5, 2), '-', substring($processStartDate, 7, 2), 'T', substring($processStartDateTime, 1, 2), ':',substring($processStartDateTime, 3, 2),':',substring($processStartDateTime, 5, 2) )"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="concat(substring($processStartDate, 1, 4), '-', substring($processStartDate, 5, 2), '-', substring($processStartDate, 7, 2), 'T00:00:01')"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </earliestProcessingStartDate>
                                    <latestProcessingStartDate>
                                        <xsl:variable name="processStartDate" select="FSSBD"/>
                                        <xsl:variable name="processStartDateTime" select="FSSBZ"/>
                                        <xsl:choose>
                                            <xsl:when test="string($processStartDateTime)">
                                                <xsl:value-of select="concat(substring($processStartDate, 1, 4), '-', substring($processStartDate, 5, 2), '-', substring($processStartDate, 7, 2), 'T', substring($processStartDateTime, 1, 2), ':',substring($processStartDateTime, 3, 2),':',substring($processStartDateTime, 5, 2) )"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="concat(substring($processStartDate, 1, 4), '-', substring($processStartDate, 5, 2), '-', substring($processStartDate, 7, 2), 'T00:00:01')"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </latestProcessingStartDate>

                                    <earliestTeardownStartDate>
                                        <xsl:variable name="teardownStartDate" select="FSSAD"/>
                                        <xsl:variable name="teardownStartDateTime" select="FSSAZ"/>
                                        <xsl:choose>
                                            <xsl:when test="string($teardownStartDateTime)">
                                                <xsl:value-of select="concat(substring($teardownStartDate, 1, 4), '-', substring($teardownStartDate, 5, 2), '-', substring($teardownStartDate, 7, 2), 'T', substring($teardownStartDateTime, 1, 2), ':',substring($teardownStartDateTime, 3, 2),':',substring($teardownStartDateTime, 5, 2) )"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="concat(substring($teardownStartDate, 1, 4), '-', substring($teardownStartDate, 5, 2), '-', substring($teardownStartDate, 7, 2), 'T00:00:01')"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </earliestTeardownStartDate>
                                    <latestTeardownStartDate>
                                        <xsl:variable name="teardownStartDate" select="FSSAD"/>
                                        <xsl:variable name="teardownStartDateTime" select="FSSAZ"/>
                                        <xsl:choose>
                                            <xsl:when test="string($teardownStartDateTime)">
                                                <xsl:value-of select="concat(substring($teardownStartDate, 1, 4), '-', substring($teardownStartDate, 5, 2), '-', substring($teardownStartDate, 7, 2), 'T', substring($teardownStartDateTime, 1, 2), ':',substring($teardownStartDateTime, 3, 2),':',substring($teardownStartDateTime, 5, 2) )"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="concat(substring($teardownStartDate, 1, 4), '-', substring($teardownStartDate, 5, 2), '-', substring($teardownStartDate, 7, 2), 'T00:00:01')"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </latestTeardownStartDate>

                                    <earliestTeardownEndDate>
                                        <xsl:variable name="teardownEndDate" select="SSEVD"/>
                                        <xsl:variable name="teardownEndDateTime" select="SSEVZ"/>
                                        <xsl:choose>
                                            <xsl:when test="string($teardownEndDateTime)">
                                                <xsl:value-of select="concat(substring($teardownEndDate, 1, 4), '-', substring($teardownEndDate, 5, 2), '-', substring($teardownEndDate, 7, 2), 'T', substring($teardownEndDateTime, 1, 2), ':',substring($teardownEndDateTime, 3, 2),':',substring($teardownEndDateTime, 5, 2) )"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="concat(substring($teardownEndDate, 1, 4), '-', substring($teardownEndDate, 5, 2), '-', substring($teardownEndDate, 7, 2), 'T00:00:01')"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </earliestTeardownEndDate>
                                    <latestTeardownEndDate>
                                        <xsl:variable name="teardownEndDate" select="SSEVD"/>
                                        <xsl:variable name="teardownEndDateTime" select="SSEVZ"/>
                                        <xsl:choose>
                                            <xsl:when test="string($teardownEndDateTime)">
                                                <xsl:value-of select="concat(substring($teardownEndDate, 1, 4), '-', substring($teardownEndDate, 5, 2), '-', substring($teardownEndDate, 7, 2), 'T', substring($teardownEndDateTime, 1, 2), ':',substring($teardownEndDateTime, 3, 2),':',substring($teardownEndDateTime, 5, 2) )"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="concat(substring($teardownEndDate, 1, 4), '-', substring($teardownEndDate, 5, 2), '-', substring($teardownEndDate, 7, 2), 'T00:00:01')"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </latestTeardownEndDate>

                                    <earliestWaitingEndDate>
                                        <xsl:variable name="waitingEndDate" select="FSSLD"/>
                                        <xsl:variable name="waitingEndDateTime" select="FSSLZ"/>
                                        <xsl:choose>
                                            <xsl:when test="string($waitingEndDateTime)">
                                                <xsl:value-of select="concat(substring($waitingEndDate, 1, 4), '-', substring($waitingEndDate, 5, 2), '-', substring($waitingEndDate, 7, 2), 'T', substring($waitingEndDateTime, 1, 2), ':',substring($waitingEndDateTime, 3, 2),':',substring($waitingEndDateTime, 5, 2) )"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="concat(substring($waitingEndDate, 1, 4), '-', substring($waitingEndDate, 5, 2), '-', substring($waitingEndDate, 7, 2), 'T00:00:01')"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </earliestWaitingEndDate>
                                    <latestWaitingEndDate>
                                        <xsl:variable name="waitingEndDate" select="FSSLD"/>
                                        <xsl:variable name="waitingEndDateTime" select="FSSLZ"/>
                                        <xsl:choose>
                                            <xsl:when test="string($waitingEndDateTime)">
                                                <xsl:value-of select="concat(substring($waitingEndDate, 1, 4), '-', substring($waitingEndDate, 5, 2), '-', substring($waitingEndDate, 7, 2), 'T', substring($waitingEndDateTime, 1, 2), ':',substring($waitingEndDateTime, 3, 2),':',substring($waitingEndDateTime, 5, 2) )"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="concat(substring($waitingEndDate, 1, 4), '-', substring($waitingEndDate, 5, 2), '-', substring($waitingEndDate, 7, 2), 'T00:00:01')"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </latestWaitingEndDate>

                                    <planSetupTime>
                                        <xsl:value-of select="RUEST"/>
                                    </planSetupTime>
                                    <planProcessingTime>
                                        <xsl:value-of select="BEARZ"/>
                                    </planProcessingTime>
                                    <planTeardownTime>
                                        <xsl:value-of select="ABRUE"/>
                                    </planTeardownTime>
                                    <setupTimeUom>
                                        <xsl:value-of select="RSTZE"/>
                                    </setupTimeUom>
                                    <processingTimeUom>
                                        <xsl:value-of select="BEAZE"/>
                                    </processingTimeUom>
                                    <teardownTimeUom>
                                        <xsl:value-of select="ARZUE"/>
                                    </teardownTimeUom>
                                </shopOrderScheduleDTO>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:for-each>
                </shopOrderScheduleDTOList>
                <!-- Sample for customFieldDtoList -->
                <customFieldDTOList>
                    <customFieldDTO>
                        <attribute>DATA_FIELD_SO_1</attribute>
                        <value>
                            <xsl:value-of select="IDOC/E1AFKOL/E1AFFLL/E1AFVOL[1]/VORNR"/>
                        </value>
                    </customFieldDTO>
                    <customFieldDTO>
                        <attribute>DATA_FIELD_SO_2</attribute>
                        <value>I Will Be Displayed In DMC</value>
                    </customFieldDTO>
                    <customFieldDTO>
                        <attribute>CD_SALES_ORDER_ID</attribute>
                        <value> 
                            <xsl:value-of select="IDOC/E1AFKOL/E1AFPOL/KDAUF"/>
                        </value>
                    </customFieldDTO>
                    <customFieldDTO>
                        <attribute>CD_CUSTOMER_NAME</attribute>
                        <value><xsl:value-of select="IDOC/E1AFKOL/E1AFPOL/NAME1"/></value>
                    </customFieldDTO>
                </customFieldDTOList>
               <!-- -->
            </shopOrderIn>

            <xsl:if test="normalize-space($PO_STATUS_FLAG) = ''">
                <!--BOM-->
                <xsl:if test="IDOC/E1AFKOL/STLAN != '' and IDOC/E1AFKOL/STLAL != ''">
                    <bomIn>
                        <bom>
                            <!--
                            <xsl:call-template name="addBomName">
                                <xsl:with-param name="material" select="IDOC/E1AFKOL/MATNR"/>
                                <xsl:with-param name="materialExt" select="IDOC/E1AFKOL/MATNR_EXTERNAL"/>
                                <xsl:with-param name="materialLong" select="IDOC/E1AFKOL/MATNR_LONG"/>
                                <xsl:with-param name="usage" select="IDOC/E1AFKOL/STLAN"/>
                                <xsl:with-param name="altBom" select="IDOC/E1AFKOL/STLAL"/>
                            </xsl:call-template>
                            -->
                            <xsl:variable name="POValue" select="IDOC/E1AFKOL/AUFNR"/>
                            <xsl:call-template name="addShopOrder">
                                <xsl:with-param name="shopOrder" select="$POValue"/>
                            </xsl:call-template>
                        </bom>
                        <description>
                            <xsl:call-template name="addMaterial">
                                <xsl:with-param name="material" select="IDOC/E1AFKOL/MATNR"/>
                                <xsl:with-param name="materialExt" select="IDOC/E1AFKOL/MATNR_EXTERNAL"/>
                                <xsl:with-param name="materialLong" select="IDOC/E1AFKOL/MATNR_LONG"/>
                            </xsl:call-template>
                        </description>
                        <erpBom>
                            <xsl:value-of select="IDOC/E1AFKOL/STLNR"/>
                        </erpBom>
                        <effectivityControl>R</effectivityControl>
                        <bomComponentDTOList>
                            <xsl:for-each select="IDOC/E1AFKOL/E1AFFLL/E1AFVOL/E1RESBL">
                                <xsl:sort select="RSPOS"/>
                                <xsl:variable name="totalQty">
                                    <xsl:choose>
                                        <xsl:when test="string(ALPGR)">
                                            <xsl:value-of select="NOMNG"/>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:value-of select="BDMNG"/>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:variable>
                                <xsl:variable name="phType" select="DUMPS"/>
                                <xsl:if test = "string(MATNR|MATNR_EXTERNAL|MATNR_LONG) and $totalQty > 0 and number(AFPOS)!=1">
                                    <bomComponentDTO>
                                        <xsl:if test="string(LGNUM)">
                                            <warehouseNumber>
                                                <xsl:value-of select="LGNUM"/>
                                            </warehouseNumber>
                                        </xsl:if>
                                        <component>
                                            <material>
                                                <xsl:call-template name="addMaterial">
                                                    <xsl:with-param name="material" select="MATNR"/>
                                                    <xsl:with-param name="materialExt" select="MATNR_EXTERNAL"/>
                                                    <xsl:with-param name="materialLong" select="MATNR_LONG"/>
                                                </xsl:call-template>
                                            </material>
                                        </component>
                                        <sequence>
                                            <xsl:value-of select="string(number(RSPOS)*10)"/>
                                        </sequence>
                                        <erpSequence>
                                            <xsl:value-of select="number(POSNR)"/>
                                        </erpSequence>
                                        <xsl:variable name="parentRef" select="MRPOS"/>
                                        <xsl:variable name="parentSeq" select="string(number($parentRef))"/>
                                        <quantity>
                                            <xsl:call-template name="calculateQuantity">
                                                    <xsl:with-param name="sign" select="SHKZG"/>
                                                    <xsl:with-param name="total" select="$totalQty"/>
                                                    <xsl:with-param name="quantity" select="//IDOC/E1AFKOL/BMENGE"/>
                                                </xsl:call-template>
                                        </quantity>
                                         <bomComponentType>
                                          <xsl:call-template name="determineComponentType">
                                                    <xsl:with-param name="bwart" select="BWART"/>
                                                    <xsl:with-param name="coproIndicator" select="KZKUP"/>
                                            </xsl:call-template>
                                        </bomComponentType>
                                        <xsl:if test="string(E1STPUL/EBORT)">
                                            <bomRefDesList>
                                                <xsl:apply-templates select="E1STPUL"/>
                                            </bomRefDesList>
                                        </xsl:if>
                                        <xsl:if test="string(RSNUM)">
                                            <reservationOrderNumber>
                                                <xsl:value-of select="RSNUM"/>
                                            </reservationOrderNumber>
                                        </xsl:if>
                                        <xsl:if test="string(RSPOS)">
                                            <reservationItemNumber>
                                                <xsl:value-of select="RSPOS"/>
                                            </reservationItemNumber>
                                        </xsl:if>
                                        <xsl:if test="string(AFPOS) and string(KZKUP)='X' and string(AFPOS)!='0000' and string(AFPOS)!='0001' ">
                                            <orderItemNumber>
                                                <xsl:value-of select="AFPOS"/>
                                            </orderItemNumber>
                                        </xsl:if>
                                        <xsl:if test="string(LGORT)">
                                                        <storageLocation>
                                                            <xsl:value-of select="LGORT"/>
                                                        </storageLocation>
                                        </xsl:if>
                                        <xsl:if test="string(MEINS)">
                                                        <unitOfMeasure>
                                                            <xsl:value-of select="MEINS"/>
                                                        </unitOfMeasure>
                                        </xsl:if>
                                        <totalQtyBaseUom>
                                            <xsl:value-of select="$totalQty"/>
                                        </totalQtyBaseUom>
                                        <bomOperationDTO>
                                            <xsl:variable name="bomOperation">
                                                <xsl:choose>
                                                    <xsl:when test="../E1AFREF/MES_OPERID">
                                                        <xsl:call-template name="getId">
                                                            <xsl:with-param name="key" select="../E1AFREF/MES_OPERID"/>
                                                        </xsl:call-template>
                                                    </xsl:when>
                                                    <xsl:when test="../ME_OPERATION_ID">
                                                        <xsl:value-of select="../ME_OPERATION_ID"/>
                                                    </xsl:when>
                                                    <xsl:otherwise>
                                                        <xsl:value-of select="$routing"/>-<xsl:value-of select="../../PLNFL"/>-<xsl:value-of select="../VORNR"/>
                                                    </xsl:otherwise>
                                                </xsl:choose>
                                            </xsl:variable>
                                            <operationDTO>
                                                <xsl:choose>
                                                    <xsl:when test="$bomOperation !='' ">
                                                        <operation>
                                                            <xsl:value-of select="$bomOperation"/>
                                                        </operation>
                                                    </xsl:when>
                                                    <xsl:when test="../ME_OPERATION_ID">
                                                        <operation>
                                                            <xsl:value-of select="../ME_OPERATION_ID"/>
                                                        </operation>
                                                    </xsl:when>
                                                    <xsl:otherwise>
                                                        <operation>
                                                            <xsl:value-of select="$routing"/>-<xsl:value-of select="../../PLNFL"/>-<xsl:value-of select="../VORNR"/>
                                                        </operation>
                                                    </xsl:otherwise>
                                                </xsl:choose>
                                                <xsl:if test="../ME_REVISION">
                                                    <version>
                                                        <xsl:value-of select="../ME_REVISION"/>
                                                    </version>
                                                </xsl:if>
                                            </operationDTO>
                                            <quantity>
                                                <xsl:variable name="releasedQty" select="//IDOC/E1AFKOL/BMENGE"/>
                                                <xsl:value-of select="$totalQty div $releasedQty"/>
                                            </quantity>
                                        </bomOperationDTO>
                                    </bomComponentDTO>
                                </xsl:if>
                            </xsl:for-each>
                        </bomComponentDTOList>
                        <customFieldDTOList>
                            <customFieldDTO>
                                <attribute>ERP_MATERIAL</attribute>
                                <value>
                                    <xsl:call-template name="addMaterial">
                                        <xsl:with-param name="material" select="IDOC/E1AFKOL/MATNR"/>
                                        <xsl:with-param name="materialExt" select="IDOC/E1AFKOL/MATNR_EXTERNAL"/>
                                        <xsl:with-param name="materialLong" select="IDOC/E1AFKOL/MATNR_LONG"/>
                                    </xsl:call-template>
                                </value>
                            </customFieldDTO>
                        </customFieldDTOList>
                    </bomIn>
                </xsl:if>

                <!--<xsl:if test="not(IDOC/E1AFKOL/E1AFFLL/E1AFVOL/E1AFREF/MES_ROUTINGID)">-->
                <xsl:if test="IDOC/E1AFKOL/E1AFFLL">
                    <!-- Routing -->
                    <routingIn>
                        <masterRouting>
                            <xsl:value-of select="concat(IDOC/E1AFKOL/PLNNR,'-',IDOC/E1AFKOL/PLNAL)"/>
                        </masterRouting>
                        <material>
                            <!--
                            <xsl:value-of select="IDOC/E1AFKOL/MATNR"/>
                            -->
                            <value>
                                    <xsl:call-template name="addMaterial">
                                        <xsl:with-param name="material" select="IDOC/E1AFKOL/MATNR"/>
                                        <xsl:with-param name="materialExt" select="IDOC/E1AFKOL/MATNR_EXTERNAL"/>
                                        <xsl:with-param name="materialLong" select="IDOC/E1AFKOL/MATNR_LONG"/>
                                    </xsl:call-template>
                                </value>
                        </material>
                        <xsl:variable name="materialNumber">
                            <xsl:call-template name="trimMaterialLeadingZeros">
                                <xsl:with-param name="material" select="IDOC/E1AFKOL/MATNR"/>
                                <xsl:with-param name="materialExt" select="IDOC/E1AFKOL/MATNR_EXTERNAL"/>
                                <xsl:with-param name="materialLong" select="IDOC/E1AFKOL/MATNR_LONG"/>
                            </xsl:call-template>
                        </xsl:variable>
                        <routing>
                            <xsl:value-of select="$routing"/>
                        </routing>
                        <description>
                            <xsl:call-template name="addMaterial">
                                <xsl:with-param name="material" select="IDOC/E1AFKOL/MATNR"/>
                                <xsl:with-param name="materialExt" select="IDOC/E1AFKOL/MATNR_EXTERNAL"/>
                                <xsl:with-param name="materialLong" select="IDOC/E1AFKOL/MATNR_LONG"/>
                            </xsl:call-template>
                        </description>
                        <effectivityControl>R</effectivityControl>
                        <temporaryRouting>false</temporaryRouting>
                        <entryRoutingStepDTO>
                            <routingDTO>
                                <routing>
                                    <xsl:value-of select="$routing"/>
                                </routing>
                                <routingType>U</routingType>
                            </routingDTO>
                            <stepId>
                                <xsl:for-each select="//IDOC/E1AFKOL/E1AFFLL/E1AFVOL[E1JSTVL[last()]/STAT!='I0013']">
                                    <xsl:sort select="VORNR"/>
                                    <xsl:if test="position()=1">
                                        <xsl:value-of select="VORNR"/>
                                    </xsl:if>
                                </xsl:for-each>
                            </stepId>
                        </entryRoutingStepDTO>
                        <routingStepDTOList>
                            <xsl:for-each select="IDOC/E1AFKOL/E1AFFLL">
                                <xsl:sort select="PLNFL"/>
                                <xsl:if test="FLGAT = 0">
                                    <xsl:for-each select="E1AFVOL[E1JSTVL[last()]/STAT!='I0013']">
                                        <xsl:sort select="VORNR"/>
                                        <xsl:variable name="seqCounter" select="position()"/>
                                        <routingStepDTO>
                                            <reportingStep>
                                                <xsl:value-of select="VORNR"/>
                                            </reportingStep>
                                            <routingStepRef>
                                                <stepId>
                                                    <xsl:choose>
                                                        <xsl:when test="VORNR">
                                                            <xsl:value-of select="VORNR"/>
                                                        </xsl:when>
                                                        <xsl:otherwise>
                                                            <xsl:number value="$seqCounter*10" format="1"/>
                                                        </xsl:otherwise>
                                                    </xsl:choose>
                                                </stepId>
                                                <xsl:if test="ME_REVISION">
                                                    <version>
                                                        <xsl:value-of select="ME_REVISION"/>
                                                    </version>
                                                </xsl:if>
                                            </routingStepRef>
                                            <erpInternalID>
                                                <xsl:value-of select="ARBID"/>
                                            </erpInternalID>
                                            <xsl:choose>
                                                <xsl:when test = "$seqCounter=count(../../E1AFFLL/E1AFVOL)">
                                                    <isLastReportingStep>true</isLastReportingStep>
                                                </xsl:when>
                                            </xsl:choose>
                                            <sequence>
                                                <xsl:number value="$seqCounter" format="1"/>
                                            </sequence>
                                            <xsl:choose>
                                                <xsl:when test="LTXA1">
                                                    <description>
                                                        <xsl:value-of select="LTXA1"/>
                                                    </description>
                                                </xsl:when>
                                                <xsl:when test="ME_OPERATION_ID">
                                                    <description>
                                                        <xsl:value-of select="ME_OPERATION_ID"/>
                                                    </description>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                    <description>
                                                        <xsl:value-of select="$routing"/>-<xsl:value-of select="//IDOC/E1AFKOL/E1AFFLL/PLNFL"/>-<xsl:value-of select="VORNR"/>
                                                    </description>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                            <controlKey>
                                                <xsl:value-of select="STEUS"/>
                                            </controlKey>
                                            <routingStepAttachmentDTOList>
                                                <xsl:for-each select="E1AFDOC/E1AFDPO">
                                                    <xsl:variable name="documentType" select="../DOKAR"/>
                                                    <xsl:if test="$documentType='PRT'">
                                                        <routingStepAttachmentDTO>
                                                            <attachedMaterial>
                                                                <xsl:call-template name="addWorkInstructionName">
                                                                    <xsl:with-param name="docName" select="../DOKNR"/>
                                                                    <xsl:with-param name="docType" select="../DOKAR"/>
                                                                    <xsl:with-param name="docPart" select="../DOKTL"/>
                                                                    <xsl:with-param name="docOriginal" select="ORIGINAL"/>
                                                                </xsl:call-template>
                                                            </attachedMaterial>
                                                            <version>
                                                                <xsl:value-of select="../DOKVR"/>
                                                            </version>
                                                            <attachmentType>W</attachmentType>
                                                        </routingStepAttachmentDTO>
                                                    </xsl:if>
                                                </xsl:for-each>
                                            </routingStepAttachmentDTOList>
                                            <routingStepComponentDTOList>
                                                <xsl:for-each select="E1RESBL">
                                                    <routingStepComponentDTO>
                                                        <materialDTO>
                                                            <material>
                                                                <xsl:value-of select="MATNR"/>
                                                            </material>
                                                            <version>#</version>
                                                        </materialDTO>
                                                        <erpSequence>
                                                            <xsl:value-of select="number(POSNR)"/>
                                                        </erpSequence>
                                                        <quantity>
                                                            <xsl:value-of select="BDMNG"/>
                                                        </quantity>
                                                    </routingStepComponentDTO>
                                                </xsl:for-each>
                                            </routingStepComponentDTOList>
                                            <routingSubstepDTOList>
                                                <xsl:for-each select="E1AFUVL[E1JSTUL[last()]/STAT!='I0013']">
                                                    <routingSubstepDTO>
                                                        <xsl:variable name="seqSubstepCounter" select="position()"/>
                                                        <xsl:variable name="field1" select="//IDOC/E1AFKOL/PLNNR"/>
                                                        <xsl:variable name="field2" select="//IDOC/E1AFKOL/PLNAL"/>
                                                        <xsl:variable name="field3" select="../../PLNFL"/>
                                                        <xsl:variable name="field4" select="../VORNR"/>
                                                        <xsl:variable name="field5" select="UVORN"/>
                                                        <xsl:variable name="substep" select="concat($field1,'-',$field2, '-',$field3, '-',$field4, '-',$field5)"/>
                                                        <substepDTO>
                                                            <substep>
                                                                <xsl:value-of select="$substep"/>
                                                            </substep>
                                                            <substepId>
                                                                <xsl:number value="$seqSubstepCounter*10" format="1"/>
                                                            </substepId>
                                                            <version>A</version>
                                                        </substepDTO>
                                                        <currentVersion>true</currentVersion>
                                                        <status>RELEASABLE</status>
                                                        <substepType>NORMAL</substepType>
                                                        <substepGroup/>
                                                        <substepTimer/>
                                                        <substepDescription>
                                                            <xsl:value-of select="../LTXA1"/>
                                                        </substepDescription>
                                                    </routingSubstepDTO>
                                                </xsl:for-each>
                                            </routingSubstepDTOList>
                                            <routingOperationDTOList>
                                                <routingOperationDTO>
                                                    <operationDTO>
                                                        <xsl:choose>
                                                            <xsl:when test="ME_OPERATION_ID">
                                                                <operation>
                                                                    <xsl:value-of select="ME_OPERATION_ID"/>
                                                                </operation>
                                                                <version>#</version>
                                                            </xsl:when>
                                                            <xsl:otherwise>
                                                                <operation>
                                                                    <xsl:value-of select="$routing"/>-<xsl:value-of select="//IDOC/E1AFKOL/E1AFFLL/PLNFL"/>-<xsl:value-of select="VORNR"/>
                                                                </operation>
                                                                <version>#</version>
                                                            </xsl:otherwise>
                                                        </xsl:choose>
                                                        <!--
                                                        <operation>
                                                            <xsl:value-of select="$routing"/>-<xsl:value-of select="//IDOC/E1AFKOL/E1AFFLL/PLNFL"/>-<xsl:value-of select="VORNR"/>
                                                        </operation>
                                                        <version>#</version>
                                                        -->
                                                    </operationDTO>
                                                    <maxLoop>0</maxLoop>
                                                    <stepType>N</stepType>
                                                </routingOperationDTO>
                                            </routingOperationDTOList>
                                            <routingCompDTO>
                                                <routingOperationDTO>
                                                    <routingStepRef>
                                                        <stepId>
                                                            <xsl:choose>
                                                                <xsl:when test="VORNR">
                                                                    <xsl:value-of select="VORNR"/>
                                                                </xsl:when>
                                                                <xsl:otherwise>
                                                                    <xsl:number value="$seqCounter*10" format="1"/>
                                                                </xsl:otherwise>
                                                            </xsl:choose>
                                                        </stepId>
                                                        <xsl:if test="ME_REVISION">
                                                            <version>
                                                                <xsl:value-of select="ME_REVISION"/>
                                                            </version>
                                                        </xsl:if>
                                                    </routingStepRef>
                                                </routingOperationDTO>
                                            </routingCompDTO>
                                            <stepId>
                                                <xsl:choose>
                                                    <xsl:when test="VORNR">
                                                        <xsl:value-of select="VORNR"/>
                                                    </xsl:when>
                                                    <xsl:otherwise>
                                                        <xsl:number value="$seqCounter*10" format="1"/>
                                                    </xsl:otherwise>
                                                </xsl:choose>
                                            </stepId>
                                            <routingNextStepDTOList>
                                                <xsl:for-each select="//IDOC/E1AFKOL/E1AFFLL/E1AFVOL[E1JSTVL[last()]/STAT!='I0013']">
                                                    <xsl:if test = "position()=$seqCounter+1">
                                                        <routingNextStepDTO>
                                                            <nextStepDTO>
                                                                <stepId>
                                                                    <xsl:choose>
                                                                        <xsl:when test="VORNR">
                                                                            <xsl:value-of select="VORNR"/>
                                                                        </xsl:when>
                                                                        <xsl:otherwise>
                                                                            <xsl:number value="position()*10" format="1"/>
                                                                        </xsl:otherwise>
                                                                    </xsl:choose>
                                                                </stepId>
                                                            </nextStepDTO>
                                                            <failurePath>false</failurePath>
                                                        </routingNextStepDTO>
                                                    </xsl:if>
                                                </xsl:for-each>
                                            </routingNextStepDTOList>
                                            <xsl:choose>
                                                <xsl:when test="ARBPL">
                                                    <erpWorkCenter>
                                                        <xsl:value-of select="ARBPL"/>
                                                    </erpWorkCenter>
                                                    <reportingCenter>
                                                        <xsl:value-of select="ARBPL"/>
                                                    </reportingCenter>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                    <xsl:if test="not(contains(ARBID,'00000000'))">
                                                        <erpWorkCenter>ERP_ID:<xsl:value-of select="ARBID"/></erpWorkCenter>
                                                        <reportingCenter>ERP_ID:<xsl:value-of select="ARBID"/></reportingCenter>
                                                    </xsl:if>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                            <standardValueKey>
                                                <xsl:value-of select="VGWTS"/>
                                            </standardValueKey>
                                            <standardWorkFormulaParamGroupDTO>
                                                <xsl:if test="VGE01 != ''">
                                                    <workCenterFormulaParam1>
                                                        <workCenterFormulaParamID/>
                                                        <standardWorkFormulaParamName>
                                                            <xsl:value-of select="E1AFVOL2/PAR01_LTXT"/>
                                                        </standardWorkFormulaParamName>
                                                        <standardWorkFormulaParamNameLanguageCode/>
                                                        <workCenterStandardWorkQty>
                                                            <xsl:value-of select="VGW01"/>
                                                        </workCenterStandardWorkQty>
                                                        <workCenterStandardWorkQtyUnitCode>
                                                            <xsl:value-of select="VGE01"/>
                                                        </workCenterStandardWorkQtyUnitCode>
                                                    </workCenterFormulaParam1>
                                                </xsl:if>
                                                <xsl:if test="VGE02 != ''">
                                                    <workCenterFormulaParam2>
                                                        <workCenterFormulaParamID/>
                                                        <standardWorkFormulaParamName>
                                                            <xsl:value-of select="E1AFVOL2/PAR02_LTXT"/>
                                                        </standardWorkFormulaParamName>
                                                        <standardWorkFormulaParamNameLanguageCode/>
                                                        <workCenterStandardWorkQty>
                                                            <xsl:value-of select="VGW02"/>
                                                        </workCenterStandardWorkQty>
                                                        <workCenterStandardWorkQtyUnitCode>
                                                            <xsl:value-of select="VGE02"/>
                                                        </workCenterStandardWorkQtyUnitCode>
                                                    </workCenterFormulaParam2>
                                                </xsl:if>
                                                <xsl:if test="VGE03 != ''">
                                                    <workCenterFormulaParam3>
                                                        <workCenterFormulaParamID/>
                                                        <standardWorkFormulaParamName>
                                                            <xsl:value-of select="E1AFVOL2/PAR03_LTXT"/>
                                                        </standardWorkFormulaParamName>
                                                        <standardWorkFormulaParamNameLanguageCode/>
                                                        <workCenterStandardWorkQty>
                                                            <xsl:value-of select="VGW03"/>
                                                        </workCenterStandardWorkQty>
                                                        <workCenterStandardWorkQtyUnitCode>
                                                            <xsl:value-of select="VGE03"/>
                                                        </workCenterStandardWorkQtyUnitCode>
                                                    </workCenterFormulaParam3>
                                                </xsl:if>
                                                <xsl:if test="VGE04 != ''">
                                                    <workCenterFormulaParam4>
                                                        <workCenterFormulaParamID/>
                                                        <standardWorkFormulaParamName>
                                                            <xsl:value-of select="E1AFVOL2/PAR04_LTXT"/>
                                                        </standardWorkFormulaParamName>
                                                        <standardWorkFormulaParamNameLanguageCode/>
                                                        <workCenterStandardWorkQty>
                                                            <xsl:value-of select="VGW04"/>
                                                        </workCenterStandardWorkQty>
                                                        <workCenterStandardWorkQtyUnitCode>
                                                            <xsl:value-of select="VGE04"/>
                                                        </workCenterStandardWorkQtyUnitCode>
                                                    </workCenterFormulaParam4>
                                                </xsl:if>
                                                <xsl:if test="VGE05 != ''">
                                                    <workCenterFormulaParam5>
                                                        <workCenterFormulaParamID/>
                                                        <standardWorkFormulaParamName>
                                                            <xsl:value-of select="E1AFVOL2/PAR05_LTXT"/>
                                                        </standardWorkFormulaParamName>
                                                        <standardWorkFormulaParamNameLanguageCode/>
                                                        <workCenterStandardWorkQty>
                                                            <xsl:value-of select="VGW05"/>
                                                        </workCenterStandardWorkQty>
                                                        <workCenterStandardWorkQtyUnitCode>
                                                            <xsl:value-of select="VGE05"/>
                                                        </workCenterStandardWorkQtyUnitCode>
                                                    </workCenterFormulaParam5>
                                                </xsl:if>
                                                <xsl:if test="VGE06 != ''">
                                                    <workCenterFormulaParam6>
                                                        <workCenterFormulaParamID/>
                                                        <standardWorkFormulaParamName>
                                                            <xsl:value-of select="E1AFVOL2/PAR06_LTXT"/>
                                                        </standardWorkFormulaParamName>
                                                        <standardWorkFormulaParamNameLanguageCode/>
                                                        <workCenterStandardWorkQty>
                                                            <xsl:value-of select="VGW06"/>
                                                        </workCenterStandardWorkQty>
                                                        <workCenterStandardWorkQtyUnitCode>
                                                            <xsl:value-of select="VGE06"/>
                                                        </workCenterStandardWorkQtyUnitCode>
                                                    </workCenterFormulaParam6>
                                                </xsl:if>
                                            </standardWorkFormulaParamGroupDTO>
                                        </routingStepDTO>
                                    </xsl:for-each>
                                </xsl:if>
                            </xsl:for-each>
                        </routingStepDTOList>
                        <customFieldDTOList>
                            <customFieldDTO>
                                <attribute>ERP_MATERIAL</attribute>
                                <value>
                                    <xsl:call-template name="addMaterial">
                                        <xsl:with-param name="material" select="IDOC/E1AFKOL/MATNR"/>
                                        <xsl:with-param name="materialExt" select="IDOC/E1AFKOL/MATNR_EXTERNAL"/>
                                        <xsl:with-param name="materialLong" select="IDOC/E1AFKOL/MATNR_LONG"/>
                                    </xsl:call-template>
                                </value>
                            </customFieldDTO>
                        </customFieldDTOList>
                    </routingIn>

                    <!-- Operation -->
                    <operationListIn>
                        <xsl:for-each select="IDOC/E1AFKOL/E1AFFLL">
                            <xsl:if test="FLGAT = 0">
                                <xsl:for-each select="E1AFVOL[E1JSTVL[last()]/STAT!='I0013']">
                                    <operationIn>
                                        <xsl:choose>
                                            <xsl:when test="ME_OPERATION_ID">
                                                <operation>
                                                    <xsl:value-of select="ME_OPERATION_ID"/>
                                                </operation>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <operation>
                                                    <xsl:value-of select="$routing"/>-<xsl:value-of select="//IDOC/E1AFKOL/E1AFFLL/PLNFL"/>-<xsl:value-of select="VORNR"/>
                                                </operation>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                        <xsl:if test="ME_REVISION">
                                            <version>
                                                <xsl:value-of select="ME_REVISION"/>
                                            </version>
                                        </xsl:if>
                                        <!-- <xsl:value-of select="$routing"/>-<xsl:value-of select="//IDOC/E1AFKOL/E1AFFLL/PLNFL"/>-<xsl:value-of select="VORNR"/> -->
                                        <xsl:choose>
                                            <xsl:when test="LTXA1">
                                                <description>
                                                    <xsl:value-of select="LTXA1"/>
                                                </description>
                                            </xsl:when>
                                            <xsl:when test="ME_OPERATION_ID">
                                                <description>
                                                    <xsl:value-of select="ME_OPERATION_ID"/>
                                                </description>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <description>
                                                    <xsl:value-of select="$routing"/>-<xsl:value-of select="//IDOC/E1AFKOL/E1AFFLL/PLNFL"/>-<xsl:value-of select="VORNR"/>
                                                </description>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                        <!--
                                        <erpInternalID>
                                            <xsl:value-of select="ARBID"/>
                                        </erpInternalID>
                                        -->
                                        <controlKey>
                                            <xsl:value-of select="STEUS"/>
                                        </controlKey>
                                        <xsl:choose>
                                            <xsl:when test="ARBPL">
                                                <erpWorkCenter>
                                                    <xsl:value-of select="ARBPL"/>
                                                </erpWorkCenter>
                                                <reportingCenter>
                                                    <xsl:value-of select="ARBPL"/>
                                                </reportingCenter>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:if test="not(contains(ARBID,'00000000'))">
                                                    <erpWorkCenter>ERP_ID:<xsl:value-of select="ARBID"/></erpWorkCenter>
                                                    <reportingCenter>ERP_ID:<xsl:value-of select="ARBID"/></reportingCenter>
                                                </xsl:if>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                        <!-- Sample for resourceType
                                        <resourceType>TEST_RESOURCE_TYPE</resourceType>
                                        -->
                                    </operationIn>
                                </xsl:for-each>
                            </xsl:if>
                            <xsl:if test="FLAGAT != 0">
                                <xsl:message terminate="yes">
                                    Only SAP Standard Routings are supported.
                                </xsl:message>
                            </xsl:if>
                        </xsl:for-each>
                    </operationListIn>
                </xsl:if>
            </xsl:if>

            <!-- Customer -->
            <!--
            <xsl:if test="IDOC/E1AFKOL/E1AFPOL[POSNR='0001']/KUNAG != '' and IDOC/E1AFKOL/E1AFPOL[POSNR='0001']/NAME1 != ''">
                <erpCustomerIn>
                    <customer>
                        <customer>
                            <xsl:value-of select="IDOC/E1AFKOL/E1AFPOL[POSNR='0001']/KUNAG"/>
                        </customer>
                        <customerName>
                            <xsl:value-of select="IDOC/E1AFKOL/E1AFPOL[POSNR='0001']/NAME1"/>
                        </customerName>
                    </customer>
                </erpCustomerIn>
            </xsl:if>
            -->

            <!-- Work Instruction -->
            <workInstructionListIn>
                <xsl:for-each select="IDOC/E1AFKOL/E1AFDFH/E1AFDHO">
                    <workInstructionIn>
                        <workInstruction>
                            <xsl:call-template name="addWorkInstructionName">
                                <xsl:with-param name="docName" select="../DOKNR"/>
                                <xsl:with-param name="docType" select="../DOKAR"/>
                                <xsl:with-param name="docPart" select="../DOKTL"/>
                                <xsl:with-param name="docOriginal" select="ORIGINAL"/>
                                <xsl:with-param name="shopOrder" select="../../AUFNR"/>
                            </xsl:call-template>
                        </workInstruction>
                        <version>
                            <xsl:value-of select="../DOKVR"/>
                        </version>
                        <erpFilename>
                            <xsl:value-of select="FILENAME"/>
                        </erpFilename>
                        <url><xsl:value-of select="URL"/></url>
                        <xsl:choose>
                            <xsl:when test="string(DESCRIPTION)!=''">
                                <description>
                                    <xsl:value-of select="DESCRIPTION"/>
                                </description>
                            </xsl:when>
                            <xsl:otherwise>
                                <description>
                                    <xsl:value-of select="../DKTXT"/>
                                </description>
                            </xsl:otherwise>
                        </xsl:choose>
                        <attachmentList>
                            <workInstructionAttachmentPointDTO>
                                <shopOrderDTO>
                                    <shopOrder>
                                        <xsl:value-of select="../../AUFNR"/>
                                    </shopOrder>
                                </shopOrderDTO>
                            </workInstructionAttachmentPointDTO>
                        </attachmentList>
                    </workInstructionIn>
                </xsl:for-each>
                <xsl:for-each select="IDOC/E1AFKOL/E1AFFLL/E1AFVOL">
                    <xsl:variable name="stepIdCounter" select="position()"/>
                    <xsl:for-each select="E1AFDFO/E1AFDOO">
                        <workInstructionIn>
                            <workInstruction>
                                <xsl:call-template name="addWorkInstructionName">
                                    <xsl:with-param name="docName" select="../DOKNR"/>
                                    <xsl:with-param name="docType" select="../DOKAR"/>
                                    <xsl:with-param name="docPart" select="../DOKTL"/>
                                    <xsl:with-param name="docOriginal" select="ORIGINAL"/>
                                    <xsl:with-param name="shopOrder" select="../../../../AUFNR"/>
                                </xsl:call-template>
                            </workInstruction>
                            <version>
                                <xsl:value-of select="../DOKVR"/>
                            </version>
                            <erpFilename>
                                <xsl:value-of select="FILENAME"/>
                            </erpFilename>
                            <url><xsl:value-of select="URL"/></url>
                            <xsl:choose>
                                <xsl:when test="string(DESCRIPTION)!=''">
                                    <description>
                                        <xsl:value-of select="DESCRIPTION"/>
                                    </description>
                                </xsl:when>
                                <xsl:otherwise>
                                    <description>
                                        <xsl:value-of select="../DKTXT"/>
                                    </description>
                                </xsl:otherwise>
                            </xsl:choose>
                            <attachmentList>
                                <workInstructionAttachmentPointDTO>
                                    <shopOrderDTO>
                                        <shopOrder>
                                            <xsl:value-of select="../../../../AUFNR"/>
                                        </shopOrder>
                                    </shopOrderDTO>
                                    <xsl:choose>
                                        <xsl:when test="../RSPOS">
                                            <bomComponentRef>
                                                <bomDTO>
                                                    <bom>
                                                        <!--
                                                        <xsl:call-template name="addBomName">
                                                            <xsl:with-param name="material" select="/*/IDOC/E1AFKOL/MATNR"/>
                                                            <xsl:with-param name="materialExt"
                                                                select="/*/IDOC/E1AFKOL/MATNR_EXTERNAL"/>
                                                            <xsl:with-param name="materialLong"
                                                                select="/*/IDOC/E1AFKOL/MATNR_LONG"/>
                                                            <xsl:with-param name="usage" select="/*/IDOC/E1AFKOL/STLAN"/>
                                                            <xsl:with-param name="altBom" select="/*/IDOC/E1AFKOL/STLAL"/>
                                                        </xsl:call-template>
                                                        -->
                                                        <xsl:variable name="POValue" select="IDOC/E1AFKOL/AUFNR"/>
                                                        <xsl:call-template name="addShopOrder">
                                                            <xsl:with-param name="shopOrder" select="$POValue"/>
                                                        </xsl:call-template>
                                                    </bom>
                                                    <bomType>U</bomType>
                                                </bomDTO>
                                                <materialDTO>
                                                    <material>
                                                        <xsl:call-template name="addMaterial">
                                                            <xsl:with-param name="material" select="/*/IDOC/E1AFKOL/E1AFFLL/E1AFVOL/E1RESBL[RSPOS=current()/../RSPOS]/MATNR"/>
                                                            <xsl:with-param name="materialExt" select="/*/IDOC/E1AFKOL/E1AFFLL/E1AFVOL/E1RESBL[RSPOS=current()/../RSPOS]/MATNR_EXTERNAL"/>
                                                            <xsl:with-param name="materialLong" select="/*/IDOC/E1AFKOL/E1AFFLL/E1AFVOL/E1RESBL[RSPOS=current()/../RSPOS]/MATNR_LONG"/>
                                                        </xsl:call-template>
                                                    </material>
                                                    <version>#</version>
                                                </materialDTO>
                                                <sequence>
                                                    <xsl:value-of select="string(number(../RSPOS)*10)"/>
                                                </sequence>
                                            </bomComponentRef>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <routingDTO>
                                                <routing>
                                                    <xsl:value-of select="$routing"/>
                                                </routing>
                                                <version>A</version>
                                                <routingType>U</routingType>
                                            </routingDTO>
                                            <routingStepRef>
                                                <stepId>
                                                    <xsl:choose>
                                                        <xsl:when test="../../E1AFREF/MES_STEPID">
                                                            <xsl:value-of select="../../E1AFREF/MES_STEPID"/>
                                                        </xsl:when>
                                                        <xsl:otherwise>
                                                            <xsl:number value="$stepIdCounter*10" format="1"/>
                                                        </xsl:otherwise>
                                                    </xsl:choose>
                                                </stepId>
                                                <xsl:if test="../../ME_REVISION">
                                                    <version>
                                                        <xsl:value-of select="../../ME_REVISION"/>
                                                    </version>
                                                </xsl:if>
                                                <routingDTO>
                                                    <routing>
                                                        <xsl:value-of select="$routing"/>
                                                    </routing>
                                                    <version>A</version>
                                                    <routingType>U</routingType>
                                                </routingDTO>
                                            </routingStepRef>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </workInstructionAttachmentPointDTO>
                            </attachmentList>
                        </workInstructionIn>
                    </xsl:for-each>
                    <xsl:for-each select="E1AFDOC/E1AFDPO">
                        <workInstructionIn>
                            <workInstruction>
                                <xsl:call-template name="addWorkInstructionName">
                                    <xsl:with-param name="docName" select="../DOKNR"/>
                                    <xsl:with-param name="docType" select="../DOKAR"/>
                                    <xsl:with-param name="docPart" select="../DOKTL"/>
                                    <xsl:with-param name="docOriginal" select="ORIGINAL"/>
                                    <xsl:with-param name="shopOrder" select="../../../../AUFNR"/>
                                </xsl:call-template>
                            </workInstruction>
                            <version>
                                <xsl:value-of select="../DOKVR"/>
                            </version>
                            <erpFilename>
                                <xsl:value-of select="FILENAME"/>
                            </erpFilename>
                            <url>
                                <xsl:value-of select="URL"/>
                            </url>
                            <xsl:choose>
                                <xsl:when test="string(DESCRIPTION)!=''">
                                    <description>
                                        <xsl:value-of select="DESCRIPTION"/>
                                    </description>
                                </xsl:when>
                                <xsl:otherwise>
                                    <description>
                                        <xsl:value-of select="../FHKTX"/>
                                    </description>
                                </xsl:otherwise>
                            </xsl:choose>
                            <attachmentList>
                                <workInstructionAttachmentPointDTO>
                                    <shopOrderDTO>
                                        <shopOrder>
                                            <xsl:value-of select="../../../../AUFNR"/>
                                        </shopOrder>
                                    </shopOrderDTO>
                                    <routingDTO>
                                        <routing>
                                            <xsl:value-of select="$routing"/>
                                        </routing>
                                        <version>A</version>
                                        <routingType>U</routingType>
                                    </routingDTO>
                                    <routingStepRef>
                                        <stepId>
                                            <xsl:choose>
                                                <xsl:when test="../../E1AFREF/MES_STEPID">
                                                    <xsl:value-of select="../../E1AFREF/MES_STEPID"/>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                    <xsl:number value="$stepIdCounter*10" format="1"/>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </stepId>
                                        <xsl:if test="../../ME_REVISION">
                                            <version>
                                                <xsl:value-of select="../../ME_REVISION"/>
                                            </version>
                                        </xsl:if>
                                        <routingDTO>
                                            <routing>
                                                <xsl:value-of select="$routing"/>
                                            </routing>
                                            <version>A</version>
                                            <routingType>U</routingType>
                                        </routingDTO>
                                    </routingStepRef>
                                </workInstructionAttachmentPointDTO>
                            </attachmentList>
                        </workInstructionIn>
                    </xsl:for-each>
                </xsl:for-each>
            </workInstructionListIn>
        </productionOrderIn>
    </xsl:template>

    <xsl:template name="addWorkInstructionName">
        <xsl:param name="docName"/>
        <xsl:param name="docType"/>
        <xsl:param name="docPart"/>
        <xsl:param name="docOriginal"/>
        <xsl:param name="shopOrder"/>
        <xsl:value-of select="concat($shopOrder, $docName,'-', $docType,'-',  $docPart,'-', $docOriginal)"/>
    </xsl:template>
     <xsl:template name="calculateQuantity">
        <xsl:param name="sign"/>
        <xsl:param name="total"/>
        <xsl:param name="quantity"/>
        <xsl:choose>
            <xsl:when test="$sign='S'">

                <xsl:value-of select="concat('-', string($total div $quantity))"/>

            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="string($total div $quantity)"/>
            </xsl:otherwise>
        </xsl:choose>

    </xsl:template>
    <xsl:template name="determineComponentType">
        <xsl:param name="bwart"/>
        <xsl:param name="coproIndicator"/>

        <xsl:choose>
            <xsl:when test="$bwart='101' and $coproIndicator='X'">

                <xsl:value-of select="string('C')"/>

            </xsl:when>
            <xsl:when test="$bwart='531'">

                <xsl:value-of select="string('B')"/>

            </xsl:when>
            <xsl:when test="$bwart='261'">

                <xsl:value-of select="string('N')"/>

            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="string('')"/>
            </xsl:otherwise>
        </xsl:choose>

    </xsl:template>
    <xsl:template name="addMaterial">
        <xsl:param name="material"/>
        <xsl:param name="materialExt"/>
        <xsl:param name="materialLong"/>
        <xsl:variable name="materialString">
            <xsl:choose>
                <xsl:when test="$materialExt!=''">
                    <xsl:value-of select="normalize-space($materialExt)"/>
                </xsl:when>
                <xsl:when test="$materialLong!=''">
                    <xsl:value-of select="normalize-space($materialLong)"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="normalize-space($material)"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="materialMask">
            <xsl:choose>
                <xsl:when test="string-length($materialExt) > 18">
                    <xsl:value-of select="'0000000000000000000000000000000000000000'"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="'000000000000000000'"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="materialNumber" select="string(number($materialString))"/>
        <xsl:choose>
            <xsl:when test="$materialNumber='NaN'">

                <xsl:value-of select="$materialString"/>

            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="format-number($materialNumber, $materialMask)"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    <xsl:template name="addBomName">
        <xsl:param name="material"/>
        <xsl:param name="materialExt"/>
        <xsl:param name="materialLong"/>
        <xsl:param name="usage"/>
        <xsl:param name="altBom"/>
        <xsl:variable name="materialString">
            <xsl:call-template name="addMaterial">
                <xsl:with-param name="material" select="$material"/>
                <xsl:with-param name="materialExt" select="$materialExt"/>
                <xsl:with-param name="materialLong" select="$materialLong"/>
            </xsl:call-template>
        </xsl:variable>
        <xsl:value-of select="concat($materialString,'-', $usage, '-', number($altBom))"/>
    </xsl:template>
    <xsl:template name="addShopOrder">
        <xsl:param name="shopOrder"/>
        <xsl:variable name="shopOrderString" select="normalize-space($shopOrder)"/>
        <xsl:variable name="shopOrderNumber" select="string($shopOrderString)"/>
        <xsl:choose>
            <xsl:when test="$shopOrderNumber='NaN'">
                <xsl:value-of select="$shopOrderString"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$shopOrderNumber"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    <xsl:template name="trimMaterialLeadingZeros">
        <xsl:param name="material"/>
        <xsl:param name="materialExt"/>
        <xsl:param name="materialLong"/>
        <xsl:variable name="materialString">
            <xsl:choose>
                <xsl:when test="$materialExt!=''">
                    <xsl:value-of select="normalize-space($materialExt)"/>
                </xsl:when>
                <xsl:when test="$materialLong!=''">
                    <xsl:value-of select="normalize-space($materialLong)"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="normalize-space($material)"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="materialNumber" select="string(number($materialString))"/>
        <xsl:choose>
            <xsl:when test="$materialNumber='NaN'">
                <xsl:value-of select="$materialString"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$materialNumber"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    <xsl:template name="getId">
        <xsl:param name="key"/>
        <xsl:value-of select="substring-before(substring-after($key,'?'),'?')"/>
    </xsl:template>
    <xsl:template name="getVersion">
        <xsl:param name="key"/>
        <xsl:value-of select="substring-after(substring-after(substring-after($key,'?'),'?'),'?')"/>
    </xsl:template>
    <xsl:template match="E1STPUL">
        <bomRefDes>
            <refDes>
                <xsl:value-of select="translate(EBORT,'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')"/>
            </refDes>
            <sequence>
                <xsl:number value="10"/>
            </sequence>
            <quantity>
                <xsl:variable name="totalQty" select="number(UPMNG)"/>
                <xsl:variable name="baseQty" select="//IDOC/E1AFKOL/BMENGE"/>
                <xsl:value-of select="$totalQty div $baseQty"/>
            </quantity>
        </bomRefDes>
    </xsl:template>
    <xsl:template name="addTimeUnits">
        <xsl:param name="erpTimeUnits"/>
        <xsl:choose>
            <xsl:when test="$erpTimeUnits ='HUR'">H</xsl:when>
            <xsl:when test="$erpTimeUnits ='MIN'">M</xsl:when>
            <xsl:when test="$erpTimeUnits ='SEC'">S</xsl:when>
        </xsl:choose>
    </xsl:template>
</xsl:stylesheet>
